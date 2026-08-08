"""
System Health Dashboard — Backend API
======================================
A small Flask REST API that exposes live system metrics (CPU, RAM, disk,
network, running processes, battery, uptime) collected with `psutil`,
for consumption by the existing React + Vite frontend.

Run:
    python app.py

Configuration (environment variables, all optional):
    PORT              Port to listen on (default: 5000)
    HOST              Host to bind to (default: 0.0.0.0)
    DEBUG             "true"/"false" — Flask debug mode (default: false)
    CORS_ORIGINS      Comma-separated list of allowed origins
                       (default: http://localhost:5173,http://127.0.0.1:5173)
    NET_MAX_MBPS       "Full scale" combined up+down Mbps used to turn network
                        throughput into a 0-100% figure for the dashboard's
                        network gauge (default: 100)
"""

import os
import platform
import socket
import threading
import time
from datetime import datetime

import psutil
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from auth import db, User

# --------------------------------------------------------------------------
# App setup
# --------------------------------------------------------------------------

app = Flask(__name__)
app.config["SECRET_KEY"] = "sysguard-secret-key"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


with app.app_context():
    db.create_all()
CORS_ORIGINS = [
    o.strip()
    for o in os.environ.get(
        "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")
    if o.strip()
]
CORS(
    app,
    origins=CORS_ORIGINS,
    supports_credentials=True
)

NET_MAX_MBPS = float(os.environ.get("NET_MAX_MBPS", "100"))

# Warm up psutil's CPU counter so the very first /api/cpu call is meaningful.
psutil.cpu_percent(interval=None)
psutil.cpu_percent(interval=None, percpu=True)


# --------------------------------------------------------------------------
# Data collection helpers (pure functions — reused across routes)
# --------------------------------------------------------------------------

def get_cpu_data():
    percent = psutil.cpu_percent(interval=0.3)
    per_core = psutil.cpu_percent(interval=None, percpu=True)
    freq = psutil.cpu_freq()
    load_avg = None
    if hasattr(os, "getloadavg"):
        try:
            load_avg = list(os.getloadavg())
        except OSError:
            load_avg = None
    return {
        "usage_percent": round(percent, 1),
        "per_core_percent": [round(c, 1) for c in per_core],
        "core_count_logical": psutil.cpu_count(logical=True),
        "core_count_physical": psutil.cpu_count(logical=False),
        "frequency_mhz": round(freq.current, 1) if freq else None,
        "load_avg": load_avg,
    }


def get_ram_data():
    vm = psutil.virtual_memory()
    swap = psutil.swap_memory()
    return {
        "percent": round(vm.percent, 1),
        "total_gb": round(vm.total / (1024 ** 3), 2),
        "used_gb": round(vm.used / (1024 ** 3), 2),
        "available_gb": round(vm.available / (1024 ** 3), 2),
        "swap_percent": round(swap.percent, 1),
        "swap_total_gb": round(swap.total / (1024 ** 3), 2),
    }


def get_disk_data():
    root = os.path.abspath(os.sep)
    usage = psutil.disk_usage(root)
    partitions = []
    for part in psutil.disk_partitions(all=False):
        try:
            pu = psutil.disk_usage(part.mountpoint)
        except (PermissionError, OSError):
            continue
        partitions.append(
            {
                "device": part.device,
                "mountpoint": part.mountpoint,
                "fstype": part.fstype,
                "percent": round(pu.percent, 1),
                "total_gb": round(pu.total / (1024 ** 3), 2),
                "used_gb": round(pu.used / (1024 ** 3), 2),
                "free_gb": round(pu.free / (1024 ** 3), 2),
            }
        )
    return {
        "percent": round(usage.percent, 1),
        "total_gb": round(usage.total / (1024 ** 3), 2),
        "used_gb": round(usage.used / (1024 ** 3), 2),
        "free_gb": round(usage.free / (1024 ** 3), 2),
        "partitions": partitions,
    }


# --- Network: track counters between requests to compute a live rate -------
_net_lock = threading.Lock()
_last_net = {"time": None, "counters": None}


def _sample_network_rate():
    global _last_net
    with _net_lock:
        now = time.time()
        counters = psutil.net_io_counters()
        prev_counters = _last_net["counters"]
        prev_time = _last_net["time"]

        if prev_counters is None or prev_time is None or (now - prev_time) <= 0:
            # No baseline yet — take a very short second sample so the
            # first request still returns a sensible rate.
            time.sleep(0.25)
            now2 = time.time()
            counters2 = psutil.net_io_counters()
            dt = max(now2 - now, 0.001)
            sent_rate = (counters2.bytes_sent - counters.bytes_sent) / dt
            recv_rate = (counters2.bytes_recv - counters.bytes_recv) / dt
            _last_net = {"time": now2, "counters": counters2}
            counters = counters2
        else:
            dt = max(now - prev_time, 0.001)
            sent_rate = (counters.bytes_sent - prev_counters.bytes_sent) / dt
            recv_rate = (counters.bytes_recv - prev_counters.bytes_recv) / dt
            _last_net = {"time": now, "counters": counters}

        return counters, max(sent_rate, 0), max(recv_rate, 0)


def get_network_data():
    counters, sent_rate, recv_rate = _sample_network_rate()
    interfaces = []
    stats = psutil.net_if_stats()
    for name, addrs in psutil.net_if_addrs().items():
        ip = next((a.address for a in addrs if a.family == socket.AF_INET), None)
        if ip:
            interfaces.append(
                {
                    "name": name,
                    "ip": ip,
                    "is_up": stats[name].isup if name in stats else None,
                }
            )
    return {
        "bytes_sent": counters.bytes_sent,
        "bytes_recv": counters.bytes_recv,
        "packets_sent": counters.packets_sent,
        "packets_recv": counters.packets_recv,
        "upload_mbps": round((sent_rate * 8) / 1_000_000, 3),
        "download_mbps": round((recv_rate * 8) / 1_000_000, 3),
        "interfaces": interfaces,
    }


# --- Processes ---------------------------------------------------------
_proc_cache = {}
_proc_cache_lock = threading.Lock()


def _priority_label(nice_value):
    if nice_value is None:
        return "Normal"
    if nice_value <= -15:
        return "Critical"
    if nice_value < 0:
        return "High"
    if nice_value == 0:
        return "Normal"
    return "Low"


def get_processes_data(sort_by="cpu", limit=200):
    global _proc_cache
    results = []
    with _proc_cache_lock:
        current_pids = set()
        for proc in psutil.process_iter(
            ["pid", "name", "status", "username", "nice", "num_threads", "create_time"]
        ):
            try:
                pid = proc.info["pid"]
                current_pids.add(pid)
                if pid not in _proc_cache:
                    _proc_cache[pid] = proc
                    proc.cpu_percent(None)  # prime the internal counter
                cached_proc = _proc_cache[pid]
                cpu = cached_proc.cpu_percent(None)
                try:
                    mem = cached_proc.memory_percent()
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    mem = 0.0
                info = proc.info
                results.append(
                    {
                        "pid": pid,
                        "name": info.get("name") or "unknown",
                        "cpu": round(cpu, 1),
                        "mem": round(mem, 1),
                        "status": (info.get("status") or "unknown").capitalize(),
                        "priority": _priority_label(info.get("nice")),
                        "user": info.get("username") or "unknown",
                        "threads": info.get("num_threads"),
                        "create_time": info.get("create_time"),
                    }
                )
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                continue

        # Drop cached handles for processes that have exited.
        for pid in list(_proc_cache.keys()):
            if pid not in current_pids:
                del _proc_cache[pid]

    sort_key = sort_by if sort_by in ("cpu", "mem", "name", "pid") else "cpu"
    reverse = sort_key in ("cpu", "mem")
    results.sort(key=lambda r: r[sort_key], reverse=reverse)

    if limit:
        results = results[:limit]

    return results


def get_battery_data():
    batt = psutil.sensors_battery()
    if batt is None:
        return {"available": False, "percent": None, "power_plugged": None, "secs_left": None}

    secs_left = batt.secsleft
    if secs_left in (psutil.POWER_TIME_UNLIMITED, psutil.POWER_TIME_UNKNOWN):
        secs_left = None

    return {
        "available": True,
        "percent": round(batt.percent, 1),
        "power_plugged": bool(batt.power_plugged),
        "secs_left": secs_left,
    }


def get_uptime_data():
    boot_ts = psutil.boot_time()
    boot_dt = datetime.fromtimestamp(boot_ts)
    delta = datetime.now() - boot_dt
    days = delta.days
    hours, remainder = divmod(delta.seconds, 3600)
    minutes, _ = divmod(remainder, 60)
    return {
        "boot_time": boot_dt.isoformat(),
        "uptime_seconds": int(delta.total_seconds()),
        "uptime_human": f"{days}d {hours}h {minutes}m",
    }


def get_system_info_data():
    vm = psutil.virtual_memory()
    disk_total = psutil.disk_usage(os.path.abspath(os.sep)).total
    uptime = get_uptime_data()

    try:
        ip = socket.gethostbyname(socket.gethostname())
    except socket.gaierror:
        ip = "127.0.0.1"

    logical = psutil.cpu_count(logical=True) or "?"
    physical = psutil.cpu_count(logical=False) or "?"
    processor = platform.processor() or platform.machine() or "Unknown processor"

    return {
        "os": f"{platform.system()} {platform.release()}",
        "hostname": socket.gethostname(),
        "processor": processor,
        "architecture": f"{platform.machine()} ({physical} cores, {logical} threads)",
        "totalRam": f"{round(vm.total / (1024 ** 3), 1)} GiB",
        "totalStorage": f"{round(disk_total / (1024 ** 3), 1)} GB",
        "ip": ip,
        "uptime": uptime["uptime_human"],
    }


def get_metrics_data():
    """Combined snapshot used by the dashboard's live stat cards."""
    cpu = get_cpu_data()["usage_percent"]
    ram = get_ram_data()["percent"]
    disk = get_disk_data()["percent"]

    net = get_network_data()
    net_mbps = net["upload_mbps"] + net["download_mbps"]
    net_percent = min(100, (net_mbps / NET_MAX_MBPS) * 100) if NET_MAX_MBPS > 0 else 0

    batt = get_battery_data()
    battery_percent = batt["percent"] if batt["available"] else 100

    # Simple composite "health score": 100 minus a weighted blend of the
    # three core load figures. Purely a heuristic for the dashboard gauge.
    weighted_load = (cpu * 0.4) + (ram * 0.35) + (disk * 0.25)
    health = max(0, min(100, round(100 - weighted_load * 0.6)))

    return {
        "cpu": round(cpu, 1),
        "ram": round(ram, 1),
        "disk": round(disk, 1),
        "net": round(net_percent, 1),
        "battery": round(battery_percent, 1) if battery_percent is not None else 100,
        "health": health,
    }


# --------------------------------------------------------------------------
# Routes
# --------------------------------------------------------------------------
# --------------------------------------------------------------------------
# Authentication Routes
# --------------------------------------------------------------------------

@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json() or {}

    username = data.get("username", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not username or not email or not password:
        return jsonify({
            "error": "Username, email and password are required."
        }), 400

    if len(password) < 6:
        return jsonify({
            "error": "Password must be at least 6 characters."
        }), 400

    if User.query.filter_by(username=username).first():
        return jsonify({
            "error": "Username already exists."
        }), 409

    if User.query.filter_by(email=email).first():
        return jsonify({
            "error": "Email already registered."
        }), 409

    user = User(
        username=username,
        email=email
    )
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    login_user(user)

    return jsonify({
        "success": True,
        "message": "Account created successfully.",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }), 201

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json() or {}

    username = data.get("username", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not username or not email or not password:
        return jsonify({
            "error": "Username, email and password are required."
        }), 400

    if len(password) < 6:
        return jsonify({
            "error": "Password must be at least 6 characters."
        }), 400

    if User.query.filter_by(email=email).first():
        return jsonify({
            "error": "Email already registered."
        }), 409

    if User.query.filter_by(username=username).first():
        return jsonify({
            "error": "Username already taken."
        }), 409

    user = User(
        username=username,
        email=email
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Registration successful.",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }), 201

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({
            "error": "Email and password are required."
        }), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({
            "error": "Invalid email or password."
        }), 401

    login_user(user)

    return jsonify({
        "success": True,
        "message": "Login successful.",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    })


@app.route("/api/logout", methods=["POST"])
def logout():
    logout_user()

    return jsonify({
        "success": True,
        "message": "Logged out successfully."
    })


@app.route("/api/me")
def me():
    if not current_user.is_authenticated:
        return jsonify({
            "authenticated": False
        }), 401

    return jsonify({
        "authenticated": True,
        "user": {
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email
        }
    })
@app.route("/api/ping")
def ping():
    return jsonify({"status": "ok", "service": "system-health-dashboard-backend"})


@app.route("/api/cpu")
def cpu_route():
    return jsonify(get_cpu_data())


@app.route("/api/ram")
def ram_route():
    return jsonify(get_ram_data())


@app.route("/api/disk")
def disk_route():
    return jsonify(get_disk_data())


@app.route("/api/network")
def network_route():
    return jsonify(get_network_data())


@app.route("/api/processes")
def processes_route():
    sort_by = request.args.get("sort", "cpu")
    limit = request.args.get("limit", default=200, type=int)
    data = get_processes_data(sort_by=sort_by, limit=limit)
    return jsonify({"processes": data, "count": len(data)})


@app.route("/api/processes/<int:pid>", methods=["DELETE"])
def end_process_route(pid):
    protected = {0, 1, os.getpid()}
    if pid in protected:
        return jsonify({"error": "Refusing to terminate a protected system process."}), 403
    try:
        proc = psutil.Process(pid)
        proc.terminate()
        try:
            proc.wait(timeout=2)
        except psutil.TimeoutExpired:
            proc.kill()
        return jsonify({"success": True, "pid": pid})
    except psutil.NoSuchProcess:
        return jsonify({"error": f"No process with pid {pid}."}), 404
    except psutil.AccessDenied:
        return (
            jsonify(
                {
                    "error": f"Permission denied terminating pid {pid}. "
                    "Try running the backend with elevated privileges."
                }
            ),
            403,
        )


@app.route("/api/battery")
def battery_route():
    return jsonify(get_battery_data())


@app.route("/api/uptime")
def uptime_route():
    return jsonify(get_uptime_data())


@app.route("/api/system-info")
def system_info_route():
    return jsonify(get_system_info_data())


@app.route("/api/metrics")
def metrics_route():
    return jsonify(get_metrics_data())


@app.route("/")
def index():
    return jsonify(
        {
            "service": "System Health Dashboard API",
            "endpoints": [
                "/api/ping",
                "/api/cpu",
                "/api/ram",
                "/api/disk",
                "/api/network",
                "/api/processes",
                "/api/processes/<pid> [DELETE]",
                "/api/battery",
                "/api/uptime",
                "/api/system-info",
                "/api/metrics",
            ],
        }
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    host = os.environ.get("HOST", "0.0.0.0")
    debug = os.environ.get("DEBUG", "false").lower() == "true"
    app.run(host=host, port=port, debug=debug, threaded=True)
