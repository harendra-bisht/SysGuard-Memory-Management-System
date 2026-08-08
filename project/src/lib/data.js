/* ============================================================
   data.js
   All dummy data + small helper hooks for the dashboard.
   No backend calls — realistic mock data only.
   ============================================================ */

import { useEffect, useState } from 'react';

// ---------- Process table seed data ----------
export const processes = [
  { pid: 1048, name: 'chrome.exe', cpu: 18.2, mem: 14.6, status: 'Running', priority: 'High', user: 'kai' },
  { pid: 2231, name: 'Code.exe', cpu: 9.4, mem: 11.2, status: 'Running', priority: 'Normal', user: 'kai' },
  { pid: 3092, name: 'Spotify.exe', cpu: 3.1, mem: 4.8, status: 'Running', priority: 'Low', user: 'kai' },
  { pid: 4120, name: 'Discord.exe', cpu: 2.2, mem: 6.1, status: 'Running', priority: 'Normal', user: 'kai' },
  { pid: 558, name: 'node.exe', cpu: 6.7, mem: 8.9, status: 'Running', priority: 'High', user: 'kai' },
  { pid: 872, name: 'python3', cpu: 4.3, mem: 5.4, status: 'Running', priority: 'Normal', user: 'system' },
  { pid: 12, name: 'kernel_task', cpu: 1.1, mem: 2.1, status: 'Running', priority: 'Critical', user: 'root' },
  { pid: 990, name: 'dockerd', cpu: 5.6, mem: 7.3, status: 'Running', priority: 'High', user: 'root' },
  { pid: 1450, name: 'mongod', cpu: 2.8, mem: 9.2, status: 'Running', priority: 'Normal', user: 'system' },
  { pid: 2103, name: 'postgres', cpu: 1.9, mem: 6.7, status: 'Sleeping', priority: 'Normal', user: 'postgres' },
  { pid: 3210, name: 'nginx', cpu: 0.8, mem: 1.4, status: 'Sleeping', priority: 'Low', user: 'www-data' },
  { pid: 441, name: 'sshd', cpu: 0.1, mem: 0.6, status: 'Idle', priority: 'Normal', user: 'root' },
  { pid: 7788, name: 'ffmpeg', cpu: 12.4, mem: 3.2, status: 'Running', priority: 'High', user: 'kai' },
  { pid: 332, name: 'WindowServer', cpu: 3.7, mem: 4.1, status: 'Running', priority: 'Critical', user: 'root' },
  { pid: 6612, name: 'slack', cpu: 2.5, mem: 5.8, status: 'Running', priority: 'Normal', user: 'kai' },
  { pid: 909, name: 'cron', cpu: 0.0, mem: 0.2, status: 'Idle', priority: 'Low', user: 'root' },
  { pid: 5530, name: 'notion', cpu: 1.6, mem: 3.9, status: 'Running', priority: 'Low', user: 'kai' },
  { pid: 7741, name: 'figma', cpu: 4.1, mem: 6.2, status: 'Running', priority: 'Normal', user: 'kai' },
];

// ---------- AI recommendations ----------
export const recommendations = [
  {
    id: 'r1',
    title: 'CPU Usage is High',
    icon: 'microchip',
    color: 'amber',
    description: 'Google Chrome is consuming excessive CPU.',
    action: 'Close inactive tabs to improve performance.',
    improvement: 'Approximately 20% CPU reduction.',
  },
  {
    id: 'r2',
    title: 'Memory Pressure Building',
    icon: 'memory',
    color: 'cyan',
    description: 'VS Code + Docker together exceed 40% of RAM.',
    action: 'Pause unused Docker containers during coding sessions.',
    improvement: 'Approximately 15% memory headroom freed.',
  },
  {
    id: 'r3',
    title: 'Disk I/O Bottleneck',
    icon: 'hard-drive',
    color: 'emerald',
    description: 'mongod sustained high write latency for 12 min.',
    action: 'Schedule a compaction or move the journal to an SSD volume.',
    improvement: 'Up to 35% faster query response.',
  },
];

// ---------- Notifications ----------
export const notifications = [
  { id: 'n1', title: 'High CPU Usage', message: 'CPU exceeded 85% for 60s', time: '2m ago', tone: 'amber', unread: true },
  { id: 'n2', title: 'Battery Low', message: 'Battery at 18% — connect charger', time: '8m ago', tone: 'rose', unread: true },
  { id: 'n3', title: 'Disk Nearly Full', message: 'Volume C: has 9% free space', time: '21m ago', tone: 'cyan', unread: true },
  { id: 'n4', title: 'Network Spike Detected', message: 'Inbound 340 Mbps on eth0', time: '44m ago', tone: 'emerald', unread: false },
  { id: 'n5', title: 'Process Crashed', message: 'ffmpeg exited with code 137', time: '1h ago', tone: 'rose', unread: false },
];

// ---------- System info ----------
export const systemInfo = {
  os: 'Ubuntu 24.04 LTS',
  hostname: 'sysguard-node-01',
  processor: 'Intel Core i7-12700H @ 2.30GHz',
  architecture: 'x86_64 (12 cores, 20 threads)',
  totalRam: '32.0 GiB DDR5',
  totalStorage: '1.0 TB NVMe SSD',
  ip: '10.0.42.18',
  uptime: '14d 6h 32m',
};

// ---------- Quick actions ----------
export const quickActions = [
  { id: 'refresh', label: 'Refresh System', icon: 'rotate', color: 'cyan' },
  { id: 'optimize', label: 'Optimize Memory', icon: 'wand-magic-sparkles', color: 'emerald' },
  { id: 'report', label: 'Generate Report', icon: 'file-lines', color: 'blue' },
  { id: 'scan', label: 'Scan Processes', icon: 'satellite-dish', color: 'amber' },
  { id: 'export', label: 'Export Data', icon: 'download', color: 'violet' },
  { id: 'restart', label: 'Restart Monitoring', icon: 'arrow-rotate-left', color: 'rose' },
];

// ---------- Hooks ----------
// Live ticking clock
export function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

// Smooth jitter around a base value
function jitter(base, amp, min = 0, max = 100) {
  const v = base + (Math.random() - 0.5) * 2 * amp;
  return Math.max(min, Math.min(max, v));
}

// Live-updating metric values
export function useLiveMetrics() {
  const [m, setM] = useState({
    cpu: 0,
    ram: 0,
    disk: 0,
    net: 0,
    battery: 100,
    health: 100,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
       const response = await fetch('http://127.0.0.1:5000/api/metrics');
        if (!response.ok) {
          throw new Error('Failed to fetch system metrics');
        }

        const data = await response.json();

        setM({
          cpu: data.cpu,
          ram: data.ram,
          disk: data.disk,
          net: data.net,
          battery: data.battery,
          health: data.health,
        });
      } catch (error) {
        console.error('Backend connection error:', error);
      }
    };

    // Get data immediately
    fetchMetrics();

    // Update every 2 seconds
    const interval = setInterval(fetchMetrics, 2000);

    return () => clearInterval(interval);
  }, []);

  return m;
}

// ---------- Chart series generators ----------
export function makeSeries(points = 24, base = 45, amp = 18) {
  const arr = [];
  for (let i = points - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 60000);
    arr.push({
      t: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      v: +(base + Math.sin(i / 2.4) * amp + (Math.random() - 0.5) * 8).toFixed(1),
    });
  }
  return arr;
}

export function makeMultiSeries(points = 24) {
  const cpu = makeSeries(points, 45, 18);
  const ram = makeSeries(points, 63, 12);
  const disk = makeSeries(points, 71, 6);
  const net = makeSeries(points, 28, 22);
  return cpu.map((c, i) => ({
    t: c.t,
    cpu: c.v,
    ram: ram[i].v,
    disk: disk[i].v,
    net: net[i].v,
  }));
}

export function makeWeekly() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((d) => ({
    t: d,
    cpu: +(38 + Math.random() * 30).toFixed(1),
    ram: +(55 + Math.random() * 25).toFixed(1),
    disk: +(68 + Math.random() * 10).toFixed(1),
    net: +(20 + Math.random() * 40).toFixed(1),
  }));
}

export function makeMonthly() {
  const weeks = ['W1', 'W2', 'W3', 'W4'];
  return weeks.map((d) => ({
    t: d,
    cpu: +(40 + Math.random() * 25).toFixed(1),
    ram: +(58 + Math.random() * 20).toFixed(1),
    disk: +(70 + Math.random() * 8).toFixed(1),
    net: +(25 + Math.random() * 30).toFixed(1),
  }));
}

export function makeHeatmap() {
  const days = 7;
  const hours = 24;
  const grid = [];
  for (let d = 0; d < days; d++) {
    for (let h = 0; h < hours; h++) {
      const peak = h >= 9 && h <= 19 ? 1 : 0.4;
      const v = Math.min(100, Math.round(peak * (40 + Math.random() * 55) + (d === 5 || d === 6 ? -15 : 0)));
      grid.push({ x: h, y: d, v: Math.max(5, v) });
    }
  }
  return grid;
}
