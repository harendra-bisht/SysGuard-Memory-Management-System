/* ============================================================
   Charts.jsx
   Recharts-based chart components (CPU area, RAM area,
   multi-line, grouped bar, top processes bar, radial gauge,
   heatmap).
   ============================================================ */

import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
  CartesianGrid, Line, LineChart, Bar, BarChart, Legend,
  RadialBar, RadialBarChart, PolarAngleAxis, Cell,
} from 'recharts';

const tooltipStyle = {
  contentStyle: {
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(11,17,32,0.92)',
    backdropFilter: 'blur(10px)',
    color: '#e2e8f0',
    fontSize: 12,
  },
  labelStyle: { color: '#e2e8f0' },
  itemStyle: { color: '#e2e8f0' },
};

const AXIS = '#64748b';

/* ---------- CPU area chart ---------- */
export function CpuAreaChart({ data, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="cpuFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={AXIS} strokeOpacity={0.12} vertical={false} />
        <XAxis dataKey="t" stroke={AXIS} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={24} />
        <YAxis stroke={AXIS} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
        <Tooltip {...tooltipStyle} />
        <Area type="monotone" dataKey="v" name="CPU" stroke="#22d3ee" strokeWidth={2.5} fill="url(#cpuFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ---------- RAM area chart ---------- */
export function RamAreaChart({ data, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="ramFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={AXIS} strokeOpacity={0.12} vertical={false} />
        <XAxis dataKey="t" stroke={AXIS} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={24} />
        <YAxis stroke={AXIS} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
        <Tooltip {...tooltipStyle} />
        <Area type="monotone" dataKey="v" name="RAM" stroke="#34d399" strokeWidth={2.5} fill="url(#ramFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ---------- Multi-line chart ---------- */
export function MultiLineChart({ data, height = 280, keys = ['cpu', 'ram', 'disk', 'net'] }) {
  const colors = { cpu: '#22d3ee', ram: '#34d399', disk: '#f59e0b', net: '#a78bfa' };
  const labels = { cpu: 'CPU', ram: 'RAM', disk: 'Disk', net: 'Network' };
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke={AXIS} strokeOpacity={0.12} vertical={false} />
        <XAxis dataKey="t" stroke={AXIS} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={24} />
        <YAxis stroke={AXIS} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
        {keys.map((k) => (
          <Line key={k} type="monotone" dataKey={k} name={labels[k]} stroke={colors[k]} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ---------- Grouped bar chart ---------- */
export function GroupedBarChart({ data, height = 280 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barGap={2}>
        <CartesianGrid stroke={AXIS} strokeOpacity={0.12} vertical={false} />
        <XAxis dataKey="t" stroke={AXIS} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis stroke={AXIS} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
        <Tooltip {...tooltipStyle} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
        <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
        <Bar dataKey="cpu" name="CPU" fill="#22d3ee" radius={[4, 4, 0, 0]} maxBarSize={28} />
        <Bar dataKey="ram" name="RAM" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={28} />
        <Bar dataKey="disk" name="Disk" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={28} />
        <Bar dataKey="net" name="Network" fill="#a78bfa" radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ---------- Top processes horizontal bar ---------- */
export function TopProcessesBar({ data, height = 260 }) {
  const palette = ['#22d3ee', '#3b82f6', '#34d399', '#f59e0b', '#a78bfa', '#f43f5e'];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid stroke={AXIS} strokeOpacity={0.1} horizontal={false} />
        <XAxis type="number" stroke={AXIS} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
        <YAxis type="category" dataKey="name" stroke={AXIS} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={80} />
        <Tooltip {...tooltipStyle} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
        <Bar dataKey="cpu" name="CPU %" radius={[0, 6, 6, 0]} maxBarSize={22}>
          {data.map((_, i) => (
            <Cell key={i} fill={palette[i % 6]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ---------- Radial gauge ---------- */
export function RadialGauge({ value, height = 220 }) {
  const data = [{ name: 'score', value, fill: value > 80 ? '#34d399' : value > 60 ? '#f59e0b' : '#f43f5e' }];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={210} endAngle={-30}>
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar background={{ fill: 'rgba(148,163,184,0.12)' }} dataKey="value" cornerRadius={12} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

/* ---------- Heatmap (pure CSS grid) ---------- */
export function Heatmap({ data }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const cellClass = (v) => {
    if (v > 80) return 'heatmap-v-high';
    if (v > 60) return 'heatmap-high';
    if (v > 40) return 'heatmap-mid';
    if (v > 20) return 'heatmap-low';
    return 'heatmap-v-low';
  };
  return (
    <div className="heatmap-wrap">
      <div className="heatmap">
        <div className="heatmap-hours">
          {Array.from({ length: 24 }).map((_, h) => (
            <div key={h} className="hour-label">{h % 3 === 0 ? `${h}h` : ''}</div>
          ))}
        </div>
        {days.map((d, dy) => (
          <div key={d} className="heatmap-row">
            <div className="heatmap-day-label">{d}</div>
            <div className="heatmap-cells">
              {Array.from({ length: 24 }).map((_, h) => {
                const c = data.find((p) => p.x === h && p.y === dy);
                return (
                  <div
                    key={h}
                    title={`${d} ${h}:00 — ${c?.v ?? 0}%`}
                    className={`heatmap-cell ${cellClass(c?.v ?? 0)}`}
                  />
                );
              })}
            </div>
          </div>
        ))}
        <div className="heatmap-legend">
          <span>Low</span>
          <span className="swatch heatmap-v-low" />
          <span className="swatch heatmap-low" />
          <span className="swatch heatmap-mid" />
          <span className="swatch heatmap-high" />
          <span className="swatch heatmap-v-high" />
          <span>High</span>
        </div>
      </div>
    </div>
  );
}
