/* ============================================================
   main.jsx
   Entry point: mounts the React app and imports all CSS.
   ============================================================ */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Bootstrap JS bundle (for any interactive components)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Custom CSS (order matters: global first, then page-specific)
import '@/css/global.css';
import '@/css/navbar.css';
import '@/css/sidebar.css';
import '@/css/dashboard.css';
import '@/css/cards.css';
import '@/css/process.css';
import '@/css/analytics.css';
import '@/css/reports.css';
import '@/css/settings.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
