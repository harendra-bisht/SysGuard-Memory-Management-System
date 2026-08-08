/* ============================================================
   SystemInfo.jsx
   Displays real hardware & environment details
   from the Flask backend.
   ============================================================ */

import { useEffect, useState } from 'react';
import { Card } from './ui';

export function SystemInfo() {
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSystemInfo = async () => {
    try {
      const response = await fetch(
        'http://127.0.0.1:5000/api/system-info'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch system information');
      }

      const data = await response.json();
      setSystemInfo(data);
    } catch (error) {
      console.error('System Info API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemInfo();

    const interval = setInterval(fetchSystemInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card>
        <div className="text-secondary-muted">
          Loading system information...
        </div>
      </Card>
    );
  }

  if (!systemInfo) {
    return (
      <Card>
        <div className="text-danger">
          Unable to load system information.
          Make sure the Flask backend is running.
        </div>
      </Card>
    );
  }

  const entries = Object.entries(systemInfo);

  return (
    <Card>
      <div className="row g-3">
        {entries.map(([k, v]) => (
          <div key={k} className="col-12 col-sm-6 col-lg-3">
            <div className="sysinfo-tile">
              <div className="sysinfo-label">
                {k
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (s) => s.toUpperCase())}
              </div>

              <div className="sysinfo-value" title={String(v)}>
                {String(v)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}