/* ============================================================
   Dashboard.jsx
   Main dashboard page: hero, stat cards, charts, AI
   recommendations, health gauge, quick actions, process
   table, notifications, analytics preview, system info, and
   resource load bars.
   ============================================================ */

import { useState } from 'react';
import { Card, SectionTitle, Button, Badge, ProgressBar } from '@/components/ui';
import { DashboardCard } from '@/components/DashboardCard';
import { CpuAreaChart, RamAreaChart, RadialGauge } from '@/components/Charts';
import { ProcessTable } from '@/components/ProcessTable';
import { AIRecommendation } from '@/components/AIRecommendation';
import { QuickActions } from '@/components/QuickActions';
import { Notifications } from '@/components/Notifications';
import { SystemInfo } from '@/components/SystemInfo';
import { useClock, useLiveMetrics, makeSeries } from '@/lib/data';

export function Dashboard() {
  const now = useClock();
  const m = useLiveMetrics();
  const [cpuSeries] = useState(() => makeSeries(24, 45, 18));
  const [ramSeries] = useState(() => makeSeries(24, 63, 12));
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const topCpu = { name: 'chrome.exe', cpu: 18.2 };
  const topMem = { name: 'Code.exe', mem: 11.2 };
  const avgCpu = 41.8;
  const avgRam = 62.4;

  // Particles for hero background
  const particles = [
    { l: '12%', t: '30%', d: '0s', s: '6px' },
    { l: '28%', t: '70%', d: '1.2s', s: '4px' },
    { l: '46%', t: '22%', d: '0.6s', s: '5px' },
    { l: '64%', t: '60%', d: '1.8s', s: '4px' },
    { l: '78%', t: '34%', d: '0.3s', s: '6px' },
    { l: '88%', t: '72%', d: '1.5s', s: '5px' },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="hero-glow hero-glow-3" />
        {particles.map((p, i) => (
          <span
            key={i}
            className="hero-particle"
            style={{ left: p.l, top: p.t, width: p.s, height: p.s, animationDelay: p.d }}
          />
        ))}
        <div className="hero-border" />

        <div className="hero-content">
          {/* Left — identity */}
          <div>
            <div className="status-badge">
              <span className="ping-ring">
                <span className="ping" />
                <span className="ping-dot" />
              </span>
              ALL SYSTEMS OPERATIONAL
            </div>
            <h1>
              System Health{' '}
              <span className="gradient-text">Dashboard</span>
            </h1>
            <div className="tagline">
              Monitor <span className="sep">•</span> Analyze <span className="sep">•</span> Optimize
            </div>
            <p className="desc">
              Track CPU, RAM, Disk, Network and Process performance with intelligent recommendations and live system insights.
            </p>
          </div>

          {/* Right — clock */}
          <div className="clock-widget">
            <div className="text-end">
              <div className="clock-time">
                {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="clock-date">
                {now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="clock-tz">
                <span className="dot" />
                UTC{now.getTimezoneOffset() <= 0 ? '+' : '-'}{Math.abs(now.getTimezoneOffset() / 60)}
              </div>
            </div>
            <div className="clock-icon-wrap">
              <div className="clock-icon-glow" />
              <svg className="clock-icon-ring" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(34,211,238,0.25)" strokeWidth="1.5" strokeDasharray="4 8" />
              </svg>
              <svg className="position-absolute" width="100%" height="100%" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(34,211,238,0.15)" strokeWidth="1" />
              </svg>
              <div className="clock-icon-inner">
                <i className="fa-regular fa-clock" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Stat cards ---------- */}
      <section className="row g-3 g-xl-4">
        <div className="col-12 col-sm-6 col-xl-4">
          <DashboardCard icon="microchip" title="CPU Usage" value={m.cpu.toFixed(1)} unit="%" tone="cyan" progress={m.cpu} trend={3} trendLabel="vs last hour" delay={0} />
        </div>
        <div className="col-12 col-sm-6 col-xl-4">
          <DashboardCard icon="memory" title="RAM Usage" value={m.ram.toFixed(1)} unit="%" tone="emerald" progress={m.ram} trend={-2} trendLabel="20.4 / 32 GiB" delay={60} />
        </div>
        <div className="col-12 col-sm-6 col-xl-4">
          <DashboardCard icon="hard-drive" title="Disk Usage" value={m.disk.toFixed(1)} unit="%" tone="amber" progress={m.disk} trend={1} trendLabel="710 / 1000 GB" delay={120} />
        </div>
        <div className="col-12 col-sm-6 col-xl-4">
          <DashboardCard icon="wifi" title="Network Usage" value={m.net.toFixed(1)} unit="%" tone="violet" progress={m.net} trend={12} trendLabel="↓ 42 ↑ 18 Mbps" delay={180} />
        </div>
        <div className="col-12 col-sm-6 col-xl-4">
          <DashboardCard icon="battery-half" title="Battery Status" value={m.battery.toFixed(0)} unit="%" tone="blue" progress={m.battery} trend={-1} trendLabel="4h 12m remaining" delay={240} />
        </div>
        <div className="col-12 col-sm-6 col-xl-4">
          <DashboardCard icon="heart-pulse" title="Health Score" value={String(m.health)} unit="/100" tone="rose" progress={m.health} trend={4} trendLabel="Excellent condition" delay={300} />
        </div>
      </section>

      {/* ---------- Charts ---------- */}
      <section className="row g-3 g-xl-4">
        <div className="col-12 col-xl-6">
          <Card>
            <SectionTitle
              icon={<i className="fa-solid fa-wave-square" />}
              title="CPU Usage Over Time"
              subtitle="Last 24 minutes · live"
              right={<Badge tone="cyan">Live</Badge>}
            />
            <CpuAreaChart data={cpuSeries} />
          </Card>
        </div>
        <div className="col-12 col-xl-6">
          <Card>
            <SectionTitle
              icon={<i className="fa-solid fa-memory" />}
              title="RAM Usage Over Time"
              subtitle="Last 24 minutes · live"
              right={<Badge tone="emerald">Live</Badge>}
            />
            <RamAreaChart data={ramSeries} />
          </Card>
        </div>
      </section>

      {/* ---------- AI Recommendations + Health gauge ---------- */}
      <section className="row g-3 g-xl-4">
        <div className="col-12 col-xl-8">
          <AIRecommendation refreshing={refreshing} onRefresh={refresh} />
        </div>
        <div className="col-12 col-xl-4">
          <Card className="d-flex flex-column h-100">
            <SectionTitle icon={<i className="fa-solid fa-heart-pulse" />} title="System Health" subtitle="Composite score" />
            <div className="gauge-wrap">
              <RadialGauge value={m.health} />
              <div className="gauge-overlay">
                <div className="gauge-value">{m.health}</div>
                <div className="gauge-sub">out of 100</div>
              </div>
            </div>
            <div className="subscore-grid">
              {[
                { k: 'Stability', v: '98%' },
                { k: 'Security', v: '95%' },
                { k: 'Performance', v: '89%' },
              ].map((s) => (
                <div key={s.k} className="subscore-tile">
                  <div className="subscore-label">{s.k}</div>
                  <div className="subscore-value tnum">{s.v}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* ---------- Quick actions ---------- */}
      <section>
        <QuickActions onAction={refresh} />
      </section>

      {/* ---------- Processes + Notifications ---------- */}
      <section className="row g-3 g-xl-4">
        <div className="col-12 col-xl-8">
          <SectionTitle icon={<i className="fa-solid fa-server" />} title="Running Processes" subtitle="Live system process table" />
          <ProcessTable compact />
        </div>
        <div className="col-12 col-xl-4">
          <Notifications />
        </div>
      </section>

      {/* ---------- Analytics preview + System info ---------- */}
      <section className="row g-3 g-xl-4">
        <div className="col-12 col-xl-8">
          <SectionTitle icon={<i className="fa-solid fa-chart-line" />} title="Analytics Preview" subtitle="Today's snapshot" />
          <div className="row g-3">
            {[
              { k: 'Top CPU Process', v: topCpu.name, s: `${topCpu.cpu}% CPU`, tone: 'cyan', icon: 'microchip' },
              { k: 'Top Memory Process', v: topMem.name, s: `${topMem.mem}% RAM`, tone: 'emerald', icon: 'memory' },
              { k: 'Average CPU Today', v: `${avgCpu}%`, s: 'across 24h', tone: 'amber', icon: 'wave-square' },
              { k: 'Average RAM Today', v: `${avgRam}%`, s: 'across 24h', tone: 'violet', icon: 'wifi' },
            ].map((c) => (
              <div key={c.k} className="col-6 col-lg-3">
                <div className="metric-tile hover-lift">
                  <div className={`tile-icon tone-bg-${c.tone}`}>
                    <i className={`fa-solid fa-${c.icon}`} />
                  </div>
                  <div className="tile-label">{c.k}</div>
                  <div className="tile-value">{c.v}</div>
                  <div className="tile-sub">{c.s}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <SectionTitle icon={<i className="fa-solid fa-server" />} title="System Information" subtitle="Hardware & environment" />
            <SystemInfo />
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <SectionTitle icon={<i className="fa-solid fa-gauge-high" />} title="Resource Load" subtitle="Real-time gauges" />
          <Card>
            {[
              { k: 'CPU Load', v: m.cpu, tone: 'cyan' },
              { k: 'Memory Load', v: m.ram, tone: 'emerald' },
              { k: 'Disk I/O', v: m.disk, tone: 'amber' },
              { k: 'Network', v: m.net, tone: 'violet' },
            ].map((g) => (
              <div key={g.k} className="load-row">
                <div className="load-header">
                  <span className="load-name">{g.k}</span>
                  <span className="load-value">{g.v.toFixed(1)}%</span>
                </div>
                <ProgressBar value={g.v} tone={g.tone} />
              </div>
            ))}
            <div className="pt-2 mt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-secondary-muted small">Uptime</span>
                <span className="font-mono" style={{ color: 'var(--accent-300)' }}>14d 6h 32m</span>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
