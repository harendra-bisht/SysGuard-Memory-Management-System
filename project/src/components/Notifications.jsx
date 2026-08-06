/* ============================================================
   Notifications.jsx
   Recent alerts feed shown on the dashboard.
   ============================================================ */

import { Card, SectionTitle } from './ui';
import { notifications } from '@/lib/data';

export function Notifications() {
  const toneColor = (tone) => {
    const map = { amber: '#f59e0b', rose: '#f43f5e', cyan: '#22d3ee', emerald: '#34d399' };
    return map[tone] || '#64748b';
  };

  return (
    <div>
      <SectionTitle icon={<i className="fa-solid fa-activity" />} title="Recent Alerts" subtitle="Notification feed" />
      <div className="notif-list">
        {notifications.map((n) => (
          <div key={n.id} className="notif-row">
            <span
              className={`notif-dot ${n.unread ? 'unread' : 'read'}`}
              style={{ background: toneColor(n.tone) }}
            />
            <div className="flex-grow-1 min-w-0">
              <div className="d-flex align-items-center justify-content-between gap-2">
                <p className="notif-title text-truncate">{n.title}</p>
                <span className="notif-time">{n.time}</span>
              </div>
              <div className="notif-msg">{n.message}</div>
            </div>
          </div>
        ))}
        <button className="notif-view-all">
          View all <i className="fa-solid fa-chevron-right" />
        </button>
      </div>
    </div>
  );
}
