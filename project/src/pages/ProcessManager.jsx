import { useEffect, useState } from 'react';
import { Card, SectionTitle, Badge } from '@/components/ui';
import { ProcessTable } from '@/components/ProcessTable';

export function ProcessManager() {
  const [processes, setProcesses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProcesses = async () => {
    try {
      setRefreshing(true);

      const response = await fetch(
        'http://127.0.0.1:5000/api/processes?sort=cpu&limit=200'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch processes');
      }

      const data = await response.json();
      setProcesses(data.processes || []);
    } catch (error) {
      console.error('Process API error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProcesses();

    const interval = setInterval(fetchProcesses, 5000);

    return () => clearInterval(interval);
  }, []);

  const total = processes.length;

  const running = processes.filter(
    (p) => p.status === 'Running'
  ).length;

  const avgCpu =
    total > 0
      ? (
          processes.reduce(
            (sum, p) => sum + Number(p.cpu || 0),
            0
          ) / total
        ).toFixed(1)
      : '0.0';

  const avgMem =
    total > 0
      ? (
          processes.reduce(
            (sum, p) => sum + Number(p.mem || 0),
            0
          ) / total
        ).toFixed(1)
      : '0.0';

  const stats = [
    {
      k: 'Total Processes',
      v: total,
      icon: 'layer-group',
      tone: 'cyan',
    },
    {
      k: 'Running',
      v: running,
      icon: 'play',
      tone: 'emerald',
    },
    {
      k: 'Avg CPU',
      v: `${avgCpu}%`,
      icon: 'microchip',
      tone: 'amber',
    },
    {
      k: 'Avg Memory',
      v: `${avgMem}%`,
      icon: 'memory',
      tone: 'violet',
    },
  ];

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-white mb-1">Process Manager</h2>
          <p className="text-secondary-muted mb-0">
            Inspect, sort and control every running process.
          </p>
        </div>

        <button
          className="btn btn-outline-info"
          onClick={fetchProcesses}
          disabled={refreshing}
        >
          <i
            className={`fa-solid fa-rotate ${
              refreshing ? 'fa-spin' : ''
            }`}
          />
          {' '}Refresh
        </button>
      </div>

      <div className="row g-3">
        {stats.map((s) => (
          <div key={s.k} className="col-6 col-lg-3">
            <Card className="d-flex align-items-center gap-3">
              <div
                className={`icon-box tone-bg-${s.tone}`}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  display: 'grid',
                  placeItems: 'center',
                  border: '1px solid currentColor',
                }}
              >
                <i className={`fa-solid fa-${s.icon}`} />
              </div>

              <div>
                <div
                  className="text-secondary-muted"
                  style={{
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {s.k}
                </div>

                <div className="fs-4 fw-bold tnum text-white">
                  {s.v}
                </div>
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
          right={
            <Badge tone="cyan">
              {total} processes
            </Badge>
          }
        />

        <ProcessTable />
      </div>
    </div>
  );
}