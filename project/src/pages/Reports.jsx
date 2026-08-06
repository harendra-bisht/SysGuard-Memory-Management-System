/* ============================================================
   Reports.jsx
   Report generation page: report cards, export buttons,
   performance summary chart, and history timeline.
   ============================================================ */

import { useState } from 'react';
import { Card, SectionTitle, Button, Badge } from '@/components/ui';
import { MultiLineChart } from '@/components/Charts';
import { makeMultiSeries } from '@/lib/data';

export function Reports() {
  const [downloading, setDownloading] = useState(null);
  const series = useState(() => makeMultiSeries(24))[0];

  const trigger = (label) => {
    setDownloading(label);
    setTimeout(() => setDownloading(null), 1500);
  };

  const reportCards = [
    { k: 'Daily Report', s: 'Aug 5, 2026', icon: 'calendar-days', tone: 'cyan', desc: "Full snapshot of today's system activity." },
    { k: 'Weekly Report', s: 'Aug 1 – Aug 5', icon: 'clock', tone: 'emerald', desc: 'Aggregated 7-day performance trends.' },
    { k: 'Monthly Report', s: 'Jul 2026', icon: 'chart-line', tone: 'amber', desc: 'Monthly summary with anomaly highlights.' },
    { k: 'Performance Summary', s: 'Last 24h', icon: 'file-lines', tone: 'violet', desc: 'Quick executive overview of health.' },
  ];

  const exports = [
    { k: 'Export PDF', icon: 'file-pdf', tone: 'rose' },
    { k: 'Export CSV', icon: 'file-csv', tone: 'emerald' },
    { k: 'Export JSON', icon: 'file-code', tone: 'cyan' },
  ];

  const history = [
    { t: '10:42', k: 'Daily Report generated', s: 'PDF · 1.2 MB', tone: 'cyan' },
    { t: '09:15', k: 'Performance Summary exported', s: 'CSV · 84 KB', tone: 'emerald' },
    { t: 'Yesterday 18:30', k: 'Weekly Report generated', s: 'PDF · 3.4 MB', tone: 'amber' },
    { t: 'Aug 1, 00:00', k: 'Monthly Report generated', s: 'PDF · 8.1 MB', tone: 'violet' },
  ];

  const toneColor = (tone) => {
    const map = { cyan: '#22d3ee', emerald: '#34d399', amber: '#f59e0b', rose: '#f43f5e', violet: '#a78bfa' };
    return map[tone] || '#64748b';
  };

  return (
    <div className="d-flex flex-column gap-4 animate-fade-in">
      <div className="reports-header">
        <h1>Reports</h1>
        <div className="sub">Generate, export and review system performance reports.</div>
      </div>

      {/* Report cards */}
      <div className="row g-3">
        {reportCards.map((r) => (
          <div key={r.k} className="col-12 col-sm-6 col-lg-3">
            <div className="report-card h-100">
              <div className="report-top">
                <div className={`report-icon tone-bg-${r.tone}`} style={{ borderColor: 'currentColor' }}>
                  <i className={`fa-solid fa-${r.icon}`} />
                </div>
                <Badge tone={r.tone}>{r.s}</Badge>
              </div>
              <h3>{r.k}</h3>
              <p className="report-desc">{r.desc}</p>
              <Button size="sm" variant="ghost" className="w-100 mt-3" onClick={() => trigger(r.k)}>
                <i className="fa-solid fa-download" /> Download
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 g-xl-4">
        <div className="col-12 col-xl-8">
          <Card>
            <SectionTitle icon={<i className="fa-solid fa-chart-line" />} title="Performance Summary" subtitle="Last 24 minutes" />
            <MultiLineChart data={series} height={280} />
          </Card>
        </div>
        <div className="col-12 col-xl-4">
          <Card>
            <SectionTitle icon={<i className="fa-solid fa-download" />} title="Export" subtitle="Choose your format" />
            <div className="d-flex flex-column gap-3">
              {exports.map((e) => (
                <button key={e.k} className="export-btn" onClick={() => trigger(e.k)}>
                  <div className={`export-icon tone-bg-${e.tone}`} style={{ borderColor: 'currentColor' }}>
                    <i className={`fa-solid fa-${e.icon}`} />
                  </div>
                  <span className="export-label">{e.k}</span>
                  {downloading === e.k ? (
                    <i className="fa-solid fa-circle-check text-success" />
                  ) : (
                    <i className="fa-solid fa-download export-arrow" />
                  )}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* History timeline */}
      <Card>
        <SectionTitle icon={<i className="fa-solid fa-clock-rotate-left" />} title="History Timeline" subtitle="Recent report generations" />
        <div className="timeline">
          <div className="timeline-line" />
          {history.map((h, i) => (
            <div key={i} className="timeline-item">
              <span className="timeline-dot" style={{ background: toneColor(h.tone) }} />
              <div className="d-flex align-items-center justify-content-between gap-3">
                <div>
                  <p className="timeline-title mb-0">{h.k}</p>
                  <span className="timeline-sub">{h.s}</span>
                </div>
                <span className="timeline-time">{h.t}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Download toast */}
      {downloading && (
        <div className="download-toast">
          <span className="spinner-app" />
          <span className="small text-white">Preparing {downloading}…</span>
        </div>
      )}
    </div>
  );
}
