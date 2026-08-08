import { useEffect, useMemo, useState } from 'react';
import { Card, Button, Badge } from './ui';

const statusTone = {
  Running: 'emerald',
  Sleeping: 'cyan',
  Idle: 'slate',
  Stopped: 'rose',
};

const priorityTone = {
  Low: 'slate',
  Normal: 'cyan',
  High: 'amber',
  Critical: 'rose',
};

export function ProcessTable({ compact = false }) {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortKey, setSortKey] = useState('cpu');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [viewRow, setViewRow] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const pageSize = compact ? 6 : 8;

  // Get real processes from Flask backend
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

      setRows(data.processes || []);
    } catch (error) {
      console.error('Process API error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Initial load + automatic refresh
  useEffect(() => {
    fetchProcesses();

    const interval = setInterval(fetchProcesses, 5000);

    return () => clearInterval(interval);
  }, []);

  const total = rows.length;

  const running = rows.filter((p) => p.status === 'Running').length;

  const avgCpu =
    total > 0
      ? (rows.reduce((sum, p) => sum + Number(p.cpu || 0), 0) / total).toFixed(1)
      : '0.0';

  const avgMem =
    total > 0
      ? (rows.reduce((sum, p) => sum + Number(p.mem || 0), 0) / total).toFixed(1)
      : '0.0';

  const filtered = useMemo(() => {
    let r = rows.filter(
      (p) =>
        p.name?.toLowerCase().includes(query.toLowerCase()) ||
        String(p.pid).includes(query)
    );

    if (statusFilter !== 'All') {
      r = r.filter((p) => p.status === statusFilter);
    }

    r = [...r].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];

      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }

      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });

    return r;
  }, [rows, query, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const pageRows = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const endProcess = async (pid) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/processes/${pid}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Could not end process');
        return;
      }

      setRows((currentRows) =>
        currentRows.filter((p) => p.pid !== pid)
      );

      if (viewRow?.pid === pid) {
        setViewRow(null);
      }
    } catch (error) {
      console.error('End process error:', error);
      alert('Could not connect to backend');
    }
  };

  const SortIcon = ({ k }) => (
    <i
      className={`fa-solid fa-chevron-${
        sortDir === 'asc' ? 'up' : 'down'
      } sort-icon ${sortKey === k ? 'active' : ''}`}
    />
  );

  const th = (label, k) => (
    <th>
      <button onClick={() => toggleSort(k)}>
        {label} <SortIcon k={k} />
      </button>
    </th>
  );

  return (
    <>
      {/* Toolbar */}
      <div className="process-toolbar">
        <div className="process-search-wrap">
          <i className="fa-solid fa-magnifying-glass" />

          <input
            className="process-search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or PID..."
          />
        </div>

        <select
          className="process-filter-select"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          {['All', 'Running', 'Sleeping', 'Idle', 'Stopped'].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <Button
          size="sm"
          variant="ghost"
          onClick={fetchProcesses}
          disabled={refreshing}
        >
          <i
            className={`fa-solid fa-rotate ${
              refreshing ? 'fa-spin' : ''
            }`}
          />
          Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="process-table-wrap">
        <div className="process-table-scroll">
          <table className="process-table">
            <thead>
              <tr>
                {th('PID', 'pid')}
                {th('Process', 'name')}
                {th('CPU %', 'cpu')}
                {th('Memory %', 'mem')}
                {th('Status', 'status')}
                {th('Priority', 'priority')}
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody>
              {pageRows.map((p) => (
                <tr key={p.pid}>
                  <td className="pid-cell">{p.pid}</td>

                  <td>
                    <div className="proc-name-cell">
                      <div className="proc-avatar">
                        {p.name.slice(0, 2)}
                      </div>

                      <div>
                        <div className="proc-name">{p.name}</div>
                        <div className="proc-user">{p.user}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="mini-bar-wrap">
                      <div className="mini-bar">
                        <div
                          className="mini-bar-fill-cpu"
                          style={{
                            width: `${Math.min(
                              100,
                              Number(p.cpu || 0) * 4
                            )}%`,
                          }}
                        />
                      </div>

                      <span className="tnum">{p.cpu}%</span>
                    </div>
                  </td>

                  <td>
                    <div className="mini-bar-wrap">
                      <div className="mini-bar">
                        <div
                          className="mini-bar-fill-mem"
                          style={{
                            width: `${Math.min(
                              100,
                              Number(p.mem || 0) * 6
                            )}%`,
                          }}
                        />
                      </div>

                      <span className="tnum">{p.mem}%</span>
                    </div>
                  </td>

                  <td>
                    <Badge tone={statusTone[p.status] || 'slate'}>
                      {p.status}
                    </Badge>
                  </td>

                  <td>
                    <Badge tone={priorityTone[p.priority] || 'slate'}>
                      {p.priority}
                    </Badge>
                  </td>

                  <td>
                    <div className="action-cell">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setViewRow(p)}
                      >
                        <i className="fa-solid fa-eye" /> View
                      </Button>

                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => endProcess(p.pid)}
                      >
                        <i className="fa-solid fa-xmark" /> End
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="process-empty">
                    No processes match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="process-pagination">
          <span className="page-info">
            Showing {pageRows.length} of {filtered.length} processes
          </span>

          <div className="page-controls">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={page === 1 ? 'opacity-50 pe-none' : ''}
            >
              <i className="fa-solid fa-arrow-left" /> Prev
            </Button>

            <span className="page-num">
              {page} / {totalPages}
            </span>

            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                setPage((p) => Math.min(totalPages, p + 1))
              }
              className={
                page === totalPages ? 'opacity-50 pe-none' : ''
              }
            >
              Next <i className="fa-solid fa-arrow-right" />
            </Button>
          </div>
        </div>
      </div>

      {viewRow && (
        <ProcessModal
          row={viewRow}
          onClose={() => setViewRow(null)}
          onKill={() => endProcess(viewRow.pid)}
        />
      )}
    </>
  );
}

/* ---------- Process detail modal ---------- */

function ProcessModal({ row, onClose, onKill }) {
  const fields = [
    { k: 'CPU Usage', v: `${row.cpu}%` },
    { k: 'Memory Usage', v: `${row.mem}%` },
    { k: 'Status', v: row.status },
    { k: 'Priority', v: row.priority },
    { k: 'User', v: row.user },
    { k: 'Threads', v: row.threads ?? 'N/A' },
    { k: 'Start Time', v: row.create_time ?? 'N/A' },
    { k: 'CPU Time', v: row.cpu_time ?? 'N/A' },
  ];

  return (
    <div className="profile-drawer-overlay">
      <div className="profile-drawer-backdrop" onClick={onClose} />

      <div className="profile-drawer">
        <div className="profile-drawer-header">
          <h3>Process Details</h3>

          <button
            className="profile-drawer-close"
            onClick={onClose}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="p-4">
          <div className="d-flex flex-column align-items-center text-center">
            <div className="profile-avatar">
              {row.name.slice(0, 2)}
            </div>

            <h4 className="mt-3 mb-0 fw-semibold text-white">
              {row.name}
            </h4>

            <p className="text-secondary-muted small mb-2">
              PID {row.pid} · {row.user}
            </p>
          </div>

          <div className="mt-4 d-flex flex-column gap-2">
            {fields.map((f) => (
              <div key={f.k} className="profile-row">
                <span className="key">{f.k}</span>
                <span className="val">{f.v}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 d-flex justify-content-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>

            <Button variant="danger" onClick={onKill}>
              <i className="fa-solid fa-xmark" /> End Process
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}