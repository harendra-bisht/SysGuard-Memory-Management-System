/* ============================================================
   App.jsx
   Root component: manages current page state, renders the
   navbar, collapsible sidebar, active page, and footer.
   ============================================================ */

import { useState } from 'react';
import { ThemeProvider } from '@/lib/theme';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { Dashboard } from '@/pages/Dashboard';
import { ProcessManager } from '@/pages/ProcessManager';
import { Analytics } from '@/pages/Analytics';
import { Reports } from '@/pages/Reports';
import { SettingsPage } from '@/pages/Settings';
import { Login } from '@/pages/Login';

function App() {
  const [page, setPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);
const [user, setUser] = useState(null);

const handleLogin = (userData) => {
  setUser(userData);
  setLoggedIn(true);
};

  // Toggle sidebar on desktop, open overlay on mobile
  const handleToggleSidebar = () => {
    if (window.innerWidth >= 992) {
      setSidebarCollapsed((v) => !v);
    } else {
      setMobileOpen((v) => !v);
    }
  };

if (!loggedIn) {
  return (
    <ThemeProvider>
      <Login onLogin={handleLogin} />
    </ThemeProvider>
  );
}
  return (
    <ThemeProvider>
      <div className="app-bg">
        <Navbar
          page={page}
          setPage={setPage}
          onToggleSidebar={handleToggleSidebar}
        />
        <Sidebar
          page={page}
          setPage={setPage}
          collapsed={sidebarCollapsed}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
        <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
          {page === 'dashboard' && <Dashboard />}
          {page === 'processes' && <ProcessManager />}
          {page === 'analytics' && <Analytics />}
          {page === 'reports' && <Reports />}
          {page === 'settings' && <SettingsPage />}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
