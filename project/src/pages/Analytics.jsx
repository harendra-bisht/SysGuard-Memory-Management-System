/* ============================================================
   Analytics.jsx
   Deep-dive analytics: stat tiles, multi-line trends,
   grouped bar chart, top processes, heatmap, and resource
   utilization gauge.
   ============================================================ */

import { useState } from 'react';
import { Card, SectionTitle, Badge, ProgressBar } from '@/components/ui';
import { MultiLineChart, GroupedBarChart, TopProcessesBar, Heatmap, RadialGauge } from '@/components/Charts';
import { makeMultiSeries, makeWeekly, makeMonthly, processes, makeHeatmap } from '@/lib/data';

export function Analytics() {
  const [range, setRange] = useState('week');
  const series = useState(() => makeMultiSeries(24))[0];
  const weekly = useState(() => makeWeekly())[0];
  const monthly = useState(() => makeMonthly())[0];
  const heat = useState(() => makeHeatmap())[0];
  const top = [...processes].sort((a, b) => b.cpu - a.cpu).slice(0, 6).map((p) => ({ name: p.name, cpu: p.cpu }));

  const stats = [
    { k: 'Avg CPU', v: '41.8%', t: '+3%', icon: 'microchip', tone: 'cyan' },
    { k: 'Avg RAM', v: '62.4%', t: '-2%', icon: 'memory', tone: 'emerald' },
    { k: 'Peak Disk I/O', v: '88%', t: '+6%', icon: 'hard-drive', tone: 'amber' },
    { k: 'Peak Network', v: '340 Mbps', t: '+12%', icon: 'wifi', tone: 'violet' },
  ];

  const gauges = [
    { k: 'CPU', v: 42, tone: 'cyan' },
    { k: 'RAM', v: 63, tone: 'emerald' },
    { k: 'Disk', v: 71, tone: 'amber' },
    { k: 'Network', v: 28, tone: 'violet' },
  ];

  return (
    <div className="d-flex flex-column gap-4 animate-fade-in">
      <div className="analytics-header">
        <div>
          <h1>Analytics</h1>
          <div className="sub">Deep-dive into resource trends and utilisation.</div>
        </div>
        <div className="range-toggle">
          {['week', 'month'].map((r) => (
            <button key={r} className={range === r ? 'active' : ''} onClick={() => setRange(r)}>
              {r === 'week' ? 'Weekly' : 'Monthly'}
            </button>
          ))}
        </div>
      </div>

      {/* Stat tiles */}
      <div className="row g-3">
        {stats.map((s) => (
          <div key={s.k} className="col-6 col-lg-3">
            <Card>
              <div className="d-flex align-items-center justify-content-between">
                <div className={`icon-box tone-bg-${s.tone}`} style={{ width: 40, height: 40, borderRadius: 12, display: 'grid', placeItems: 'center', border: '1px solid currentColor' }}>
                  <i className={`fa-solid fa-${s.icon}`} />
                </div>
                <Badge tone={s.t.startsWith('+') ? 'emerald' : 'rose'}>{s.t}</Badge>
              </div>
              <div className="mt-3 fs-4 fw-bold tnum text-white">{s.v}</div>
              <div className="text-secondary-muted small">{s.k}</div>
            </Card>
          </div>
        ))}
      </div>

      {/* Trends */}
      <Card>
        <SectionTitle
          icon={<i className="fa-solid fa-wave-square" />}
          title="Resource Trends"
          subtitle="CPU, RAM, Disk & Network over the last 24 minutes"
          right={<Badge tone="cyan">Live</Badge>}
        />
        <MultiLineChart data={series} height={300} />
      </Card>

      <div className="row g-3 g-xl-4">
        <div className="col-12 col-xl-6">
          <Card>
            <SectionTitle icon={<i className="fa-solid fa-calendar-days" />} title={range === 'week' ? 'Weekly Performance' : 'Monthly Performance'} subtitle="Aggregated averages" />
            <GroupedBarChart data={range === 'week' ? weekly : monthly} height={300} />
          </Card>
        </div>
        <div className="col-12 col-xl-6">
          <Card>
            <SectionTitle icon={<i className="fa-solid fa-chart-column" />} title="Top Processes" subtitle="By CPU consumption" />
            <TopProcessesBar data={top} height={300} />
          </Card>
        </div>
      </div>

      {/* Heatmap + utilization */}
      <div className="row g-3 g-xl-4">
        <div className="col-12 col-xl-8">
          <Card>
            <SectionTitle icon={<i className="fa-solid fa-fire" />} title="Activity Heatmap" subtitle="CPU intensity by day & hour" />
            <Heatmap data={heat} />
          </Card>
        </div>
        <div className="col-12 col-xl-4">
          <Card>
            <SectionTitle icon={<i className="fa-solid fa-server" />} title="Resource Utilization" subtitle="Current load" />
            <div className="gauge-wrap mb-2">
              <RadialGauge value={68} height={200} />
              <div className="gauge-overlay">
                <div className="gauge-value">68%</div>
                <div className="gauge-sub">overall</div>
              </div>
            </div>
            <div className="d-flex flex-column gap-3">
              {gauges.map((g) => (
                <div key={g.k}>
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="text-secondary-muted">{g.k}</span>
                    <span className="tnum fw-semibold text-white">{g.v}%</span>
                  </div>
                  <ProgressBar value={g.v} tone={g.tone} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
