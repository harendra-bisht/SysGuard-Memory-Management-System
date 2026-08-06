/* ============================================================
   ProcessManager.jsx
   Full process management page with summary stat cards and
   the complete process table.
   ============================================================ */

import { useState } from 'react';
import { Card, SectionTitle, Button, Badge } from '@/components/ui';
import { ProcessTable } from '@/components/ProcessTable';
import { processes } from '@/lib/data';

export function ProcessManager() {
  const [refreshing, setRefreshing] = useState(false);
  const refresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1200); };

  const total = processes.length;
  const running = processes.filter((p) => p.status === 'Running').length;
  const avgCpu = (processes.reduce((a, p) => a + p.cpu, 0) / processes.length).toFixed(1);
  const avgMem = (processes.reduce((a, p) => a + p.mem, 0) / processes.length).toFixed(1);

  const stats = [
    { k: 'Total Processes', v: total, icon: 'layer-group', tone: 'cyan' },
    { k: 'Running', v: running, icon: 'play', tone: 'emerald' },
    { k: 'Avg CPU', v: `${avgCpu}%`, icon: 'microchip', tone: 'amber' },
    { k: 'Avg Memory', v: `${avgMem}%`, icon: 'memory', tone: 'violet' },
  ];

  return (
    <div className="d-flex flex-column gap-4 animate-fade-in">
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
        <div>
          <h1 className="fw-bold text-white mb-0">Process Manager</h1>
          <p className="text-secondary-muted small mt-1 mb-0">Inspect, sort and control every running process.</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="ghost" onClick={refresh}>
            <i className={`fa-solid fa-rotate ${refreshing ? 'fa-spin' : ''}`} /> Refresh
          </Button>
          <Button variant="primary"><i className="fa-solid fa-wave-square" /> Auto-Refresh On</Button>
        </div>
      </div>

      <div className="row g-3">
        {stats.map((s) => (
          <div key={s.k} className="col-6 col-lg-3">
            <Card className="d-flex align-items-center gap-3">
              <div className={`icon-box tone-bg-${s.tone}`} style={{ width: 44, height: 44, borderRadius: 12, display: 'grid', placeItems: 'center', border: '1px solid currentColor' }}>
                <i className={`fa-solid fa-${s.icon}`} />
              </div>
              <div>
                <div className="text-secondary-muted" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.k}</div>
                <div className="fs-4 fw-bold tnum text-white">{s.v}</div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <div>
        <SectionTitle
          icon={<i className="fa-solid fa-server" />}
          title="All Processes"
          subtitle="Search, filter, sort and manage"
          right={<Badge tone="cyan">{total} processes</Badge>}
        />
        <ProcessTable />
      </div>
    </div>
  );
}
