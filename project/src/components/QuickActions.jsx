/* ============================================================
   QuickActions.jsx
   Grid of one-click system operation buttons (refresh,
   optimize, report, scan, export, restart).
   ============================================================ */

import { SectionTitle } from './ui';
import { quickActions } from '@/lib/data';

export function QuickActions({ onAction }) {
  return (
    <div>
      <SectionTitle icon={<i className="fa-solid fa-bolt" />} title="Quick Actions" subtitle="One-click system operations" />
      <div className="row g-3">
        {quickActions.map((a, i) => (
          <div key={a.id} className="col-6 col-sm-4 col-lg-2">
            <button
              className="quick-action-btn w-100"
              style={{ animationDelay: `${i * 50}ms` }}
              onClick={onAction}
            >
              <div className={`qa-icon tone-bg-${a.color}`} style={{ borderColor: 'currentColor' }}>
                <i className={`fa-solid fa-${a.icon}`} />
              </div>
              <span className="qa-label">{a.label}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
