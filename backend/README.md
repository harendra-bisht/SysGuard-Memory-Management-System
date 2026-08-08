# System Health Dashboard — Backend

Flask REST API built on `psutil` that serves live system metrics: CPU, RAM,
disk, network, running processes, battery, and uptime.

## Setup (VS Code / local)

1. Open this `backend` folder in VS Code (or `cd` into it in a terminal).
2. Create and activate a virtual environment:

   ```bash
   python -m venv venv

   # macOS / Linux
   source venv/bin/activate

   # Windows (PowerShell)
   venv\Scripts\Activate.ps1
   ```
3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```
4. (Optional) copy `.env.example` to `.env` and adjust values — `PORT`,
   `CORS_ORIGINS`, etc. The app reads plain environment variables, so either
   `export` them in your shell or install `python-dotenv` if you want the
   `.env` file auto-loaded.
5. Run the server:

   ```bash
   python app.py
   ```

   You should see it listening on `http://localhost:5000`.

## Endpoints

| Method | Path                     | Description                                   |
|--------|--------------------------|------------------------------------------------|
| GET    | `/api/ping`              | Health check for the API itself                |
| GET    | `/api/cpu`                | Usage %, per-core %, core counts, frequency    |
| GET    | `/api/ram`                 | RAM usage %, totals, swap                      |
| GET    | `/api/disk`               | Disk usage % + per-partition breakdown         |
| GET    | `/api/network`            | Live upload/download Mbps, byte/packet counters|
| GET    | `/api/processes`          | All running processes (`?sort=cpu\|mem\|name\|pid&limit=200`) |
| DELETE | `/api/processes/<pid>`    | Terminate a process by PID                     |
| GET    | `/api/battery`            | Battery %, plugged state (or `available:false`)|
| GET    | `/api/uptime`             | Boot time, uptime in seconds + human string    |
| GET    | `/api/system-info`        | OS, hostname, processor, RAM/storage totals, IP|
| GET    | `/api/metrics`            | Combined snapshot (`cpu, ram, disk, net, battery, health`) used by the dashboard's live stat cards |

All responses are JSON. CORS is enabled for the origins listed in
`CORS_ORIGINS` (defaults to the Vite dev server on port 5173).

## Notes

- **Process termination** (`DELETE /api/processes/<pid>`) actually calls
  `terminate()`/`kill()` on the real OS process. PID 0, PID 1, and the
  backend's own PID are blocked. Run with appropriate OS permissions if you
  need to end processes owned by other users.
- **Network rate** is computed by comparing counters between successive
  requests (or a short internal sample on the very first call), not a fixed
  polling daemon — no background thread required.
- **Health score** in `/api/metrics` is a simple heuristic (`100` minus a
  weighted blend of CPU/RAM/disk load), not a scientific measurement.
- For production use, run behind a proper WSGI server (e.g. `gunicorn` or
  `waitress`) instead of the Flask dev server, and lock down `CORS_ORIGINS`.
