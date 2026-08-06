/* ============================================================
   Sidebar.jsx
   Collapsible left sidebar with navigation links and a
   health-score mini-widget. On mobile it becomes an overlay.
   ============================================================ */

import { navItems } from './Navbar';

export function Sidebar({ page, setPage, collapsed, onToggle, mobileOpen, onCloseMobile }) {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && <div className="sidebar-backdrop d-lg-none" onClick={onCloseMobile} />}

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-label">Navigation</div>
        {navItems.map((item) => {
          const active = page === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-link ${active ? 'active' : ''}`}
              onClick={() => { setPage(item.id); onCloseMobile(); }}
              title={item.label}
            >
              <i className={`fa-solid fa-${item.icon}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Health mini-widget (hidden when collapsed) */}
        <div className="sidebar-health">
          <div className="label">System Health</div>
          <div className="value">92<span className="fs-6 text-secondary-muted">/100</span></div>
          <div className="bar">
            <div className="bar-fill" style={{ width: '92%' }} />
          </div>
        </div>
      </aside>
    </>
  );
}
