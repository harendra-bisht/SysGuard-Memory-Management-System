/* ============================================================
   Navbar.jsx
   Top navigation bar with logo, desktop nav links, theme
   toggle, notification dropdown, profile drawer, and mobile
   menu. Also contains the sidebar toggle button.
   ============================================================ */

import { useState } from 'react';
import { useTheme } from '@/lib/theme';
import { notifications as defaultNotifs } from '@/lib/data';

export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'gauge' },
  { id: 'processes', label: 'Process Manager', icon: 'microchip' },
  { id: 'analytics', label: 'Analytics', icon: 'chart-line' },
  { id: 'reports', label: 'Reports', icon: 'file-lines' },
  { id: 'settings', label: 'Settings', icon: 'gear' },
];

export function Navbar({ page, setPage, onToggleSidebar }) {
  const { theme, toggle } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const unread = defaultNotifs.filter((n) => n.unread).length;

  const toneColor = (tone) => {
    const map = { amber: '#f59e0b', rose: '#f43f5e', cyan: '#22d3ee', emerald: '#34d399' };
    return map[tone] || '#64748b';
  };

  return (
    <>
    <header className="navbar-app">
      <div className="container-fluid px-3 px-sm-4">
        <div className="d-flex align-items-center justify-content-between" style={{ height: 'var(--navbar-height)' }}>
          {/* Logo + sidebar toggle */}
          <div className="d-flex align-items-center gap-2">
            <button className="action-btn sidebar-toggle d-none d-lg-grid" onClick={onToggleSidebar} aria-label="Toggle sidebar">
              <i className="fa-solid fa-bars" />
            </button>
            <button className="action-btn d-lg-none" onClick={onToggleSidebar} aria-label="Open menu">
              <i className="fa-solid fa-bars" />
            </button>
            <button className="logo-btn" onClick={() => setPage('dashboard')}>
              <div className="logo-icon">
                <i className="fa-solid fa-shield-halved" />
              </div>
              <div className="text-start lh-1">
                <div className="logo-text">
                  System Health <span className="accent">Dashboard</span>
                </div>
                <div className="logo-sub">OS Performance Monitor</div>
              </div>
            </button>
          </div>

          {/* Desktop nav */}
          <nav className="nav-links d-none d-lg-flex">
            {navItems.map((item) => {
              const active = page === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-link-btn ${active ? 'active' : ''}`}
                  onClick={() => setPage(item.id)}
                >
                  <i className={`fa-solid fa-${item.icon}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="d-flex align-items-center gap-1">
            <button className="action-btn" onClick={toggle} aria-label="Toggle theme">
              <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} />
            </button>

            {/* Notifications */}
            <div className="bell-wrapper">
              <button className="action-btn" onClick={() => setBellOpen((v) => !v)} aria-label="Notifications">
                <i className="fa-solid fa-bell" />
                {unread > 0 && <span className="bell-badge">{unread}</span>}
              </button>
              {bellOpen && (
                <>
                  <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1030 }} onClick={() => setBellOpen(false)} />
                  <div className="notif-dropdown">
                    <div className="notif-header">
                      <span className="title">Notifications</span>
                      <span className="count">{unread} unread</span>
                    </div>
                    <div className="notif-body">
                      {defaultNotifs.map((n) => (
                        <div key={n.id} className="notif-item">
                          <span className="notif-dot" style={{ background: toneColor(n.tone) }} />
                          <div className="flex-grow-1 min-w-0">
                            <div className="d-flex align-items-center justify-content-between gap-2">
                              <p className="notif-item-title text-truncate">{n.title}</p>
                              <span className="notif-item-time">{n.time}</span>
                            </div>
                            <div className="notif-item-msg">{n.message}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="notif-footer-btn">View all notifications</button>
                  </div>
                </>
              )}
            </div>

            <button className="action-btn" onClick={() => setDrawerOpen(true)} aria-label="Profile">
              <i className="fa-solid fa-user" />
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="mobile-nav d-lg-none">
            <div className="container-fluid px-0">
              {navItems.map((item) => {
                const active = page === item.id;
                return (
                  <button
                    key={item.id}
                    className={`nav-link-btn ${active ? 'active' : ''}`}
                    onClick={() => { setPage(item.id); setMobileOpen(false); }}
                  >
                    <i className={`fa-solid fa-${item.icon}`} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>

      {drawerOpen && <ProfileDrawer onClose={() => setDrawerOpen(false)} />}
    </>
  );
}

/* ---------- Profile drawer ---------- */
function ProfileDrawer({ onClose }) {
  const rows = [
    { k: 'Email', v: 'bishtharendra758@gmail.com' },
    { k: 'Role', v: 'System Administrator' },
    { k: 'Project', v: 'System Health Dashboard' },
    { k: 'Department', v: 'Operating Systems' },
    { k: 'Last Login', v: 'Aug 6, 2026 · 08:42 UTC' },
    { k: 'Member Since', v: 'January 2024' },
    { k: 'Device', v: 'Workstation · x86_64' },
    { k: 'Operating System', v: 'Ubuntu 24.04 LTS' },
  ];
  return (
    <div className="profile-drawer-overlay">
      <div className="profile-drawer-backdrop" onClick={onClose} />
      <div className="profile-drawer">
        <div className="profile-drawer-header">
          <h3>Profile</h3>
          <button className="profile-drawer-close" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="profile-drawer-body">
          <div className="d-flex flex-column align-items-center text-center">
            <div className="profile-avatar">HB</div>
            <h4 className="mt-3 mb-0 fw-semibold" style={{ color: 'var(--heading-color)' }}>Harendra Bisht</h4>
            <p className="small mb-2" style={{ color: 'var(--text-secondary)' }}>System Administrator</p>
            <span className="online-badge">
              <span className="dot" /> System Status: Online
            </span>
          </div>
          <div className="mt-4 d-flex flex-column gap-2">
            {rows.map((r) => (
              <div key={r.k} className="profile-row">
                <span className="key">{r.k}</span>
                <span className="val">{r.v}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 d-flex flex-column gap-2">
            <button className="profile-action-btn primary">
              <i className="fa-solid fa-user-pen" /> Edit Profile
            </button>
            <button className="profile-action-btn">
              <i className="fa-solid fa-gear" /> Account Settings
            </button>
            <button className="profile-action-btn danger">
              <i className="fa-solid fa-arrow-right-from-bracket" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
