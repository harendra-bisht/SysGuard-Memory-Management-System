/* ============================================================
   Footer.jsx
   Responsive footer with branding and links.
   ============================================================ */

export function Footer() {
  return (
    <footer className="mt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="container-fluid px-3 px-sm-4 py-4">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2">
            <div className="logo-icon" style={{ width: 32, height: 32, fontSize: '0.85rem' }}>
              <i className="fa-solid fa-shield-halved" />
            </div>
            <div>
              <div className="small fw-semibold text-white">System Health Dashboard</div>
              <div className="text-secondary-muted" style={{ fontSize: 11 }}>Version 1.0 · Developed by Team System Health</div>
            </div>
          </div>
          <div className="d-flex align-items-center gap-4 small text-secondary-muted">
            <a href="#" className="text-decoration-none footer-link">Privacy Policy</a>
            <a href="#" className="text-decoration-none footer-link">Terms</a>
            <span className="text-secondary-muted">|</span>
            <div className="d-flex align-items-center gap-3">
              <a href="#" aria-label="GitHub" className="footer-link"><i className="fa-brands fa-github" /></a>
              <a href="#" aria-label="Twitter" className="footer-link"><i className="fa-brands fa-twitter" /></a>
              <a href="#" aria-label="Email" className="footer-link"><i className="fa-solid fa-envelope" /></a>
            </div>
          </div>
        </div>
        <div className="text-center mt-3 text-secondary-muted" style={{ fontSize: 12 }}>
          © 2026 System Health Dashboard. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
