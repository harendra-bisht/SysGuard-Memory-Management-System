/* ============================================================
   SystemInfo.jsx
   Displays hardware & environment details (OS, hostname,
   processor, RAM, storage, IP, uptime) in a grid of tiles.
   ============================================================ */

import { Card } from './ui';
import { systemInfo } from '@/lib/data';

export function SystemInfo() {
  const entries = Object.entries(systemInfo);
  return (
    <Card>
      <div className="row g-3">
        {entries.map(([k, v]) => (
          <div key={k} className="col-12 col-sm-6 col-lg-3">
            <div className="sysinfo-tile">
              <div className="sysinfo-label">
                {k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
              </div>
              <div className="sysinfo-value" title={v}>{v}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
