/* ============================================================
   DashboardCard.jsx
   Reusable stat card for CPU, RAM, Disk, Network, Battery,
   and Health Score. Shows icon, value, trend badge, and a
   progress bar.
   ============================================================ */

import { Card, ProgressBar } from './ui';

export function DashboardCard({ icon, title, value, unit, tone, progress, trend, trendLabel, delay = 0 }) {
  const up = trend >= 0;

  return (
    <Card className="stat-card hover-lift" style={{ animationDelay: `${delay}ms` }}>
      {/* Glow orb */}
      <div className={`glow-orb tone-bg-${tone}`} />

      <div className="card-top">
        <div className={`icon-box tone-bg-${tone}`} style={{ borderColor: 'currentColor' }}>
          <i className={`fa-solid fa-${icon}`} />
        </div>
        <div className={`trend-badge ${up ? 'trend-up' : 'trend-down'}`}>
          <i className={`fa-solid fa-arrow-${up ? 'up' : 'down'}`} />
          {Math.abs(trend)}%
        </div>
      </div>

      <div className="card-body-area">
        <p className="card-title">{title}</p>
        <div className="card-value-row">
          <span className="card-value">{value}</span>
          {unit && <span className="card-unit">{unit}</span>}
        </div>
        {trendLabel && <p className="card-trend-label">{trendLabel}</p>}
      </div>

      <div className="card-progress">
        <ProgressBar value={progress} tone={tone} />
      </div>
    </Card>
  );
}
