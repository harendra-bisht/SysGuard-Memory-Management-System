/* ============================================================
   ProcessTable.jsx
   Sortable, searchable, paginated process table with a
   detail modal. Uses dummy data from data.js.
   ============================================================ */

import { useMemo, useState } from 'react';
import { Card, Button, Badge } from './ui';
import { processes as seed } from '@/lib/data';

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
  const [rows, setRows] = useState(seed);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortKey, setSortKey] = useState('cpu');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [viewRow, setViewRow] = useState(null);
  const pageSize = compact ? 6 : 8;

  const filtered = useMemo(() => {
    let r = rows.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) || String(p.pid).includes(query)
    );
    if (statusFilter !== 'All') r = r.filter((p) => p.status === statusFilter);
    r = [...r].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return r;
  }, [rows, query, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (k) => {
    if (sortKey === k) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(k); setSortDir('desc'); }
  };

  const endProcess = (pid) => {
    setRows((rs) => rs.filter((p) => p.pid !== pid));
    if (viewRow?.pid === pid) setViewRow(null);
  };

  const SortIcon = ({ k }) => (
    <i className={`fa-solid fa-chevron-${sortDir === 'asc' ? 'up' : 'down'} sort-icon ${sortKey === k ? 'active' : ''}`} />
  );

  const th = (label, k) => (
    <th>
      <button onClick={() => toggleSort(k)}>
        {label}
        <SortIcon k={k} />
      </button>
    </th>
  );

  return (
    <>
      {/* Toolbar */}
      <div className="process-toolbar">
        <div className="process-search-wrap">
          <i className="fa-solid fa-magnifying-glass search-icon" />
          <input
            className="process-search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search by name or PID..."
          />
        </div>
        <select
          className="process-filter-select"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          {['All', 'Running', 'Sleeping', 'Idle', 'Stopped'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
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
                      <div className="proc-avatar">{p.name.slice(0, 2)}</div>
                      <div>
                        <div className="proc-name">{p.name}</div>
                        <div className="proc-user">{p.user}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="mini-bar-wrap">
                      <div className="mini-bar">
                        <div className="mini-bar-fill-cpu" style={{ width: `${Math.min(100, p.cpu * 4)}%` }} />
                      </div>
                      <span className="tnum">{p.cpu}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="mini-bar-wrap">
                      <div className="mini-bar">
                        <div className="mini-bar-fill-mem" style={{ width: `${Math.min(100, p.mem * 6)}%` }} />
                      </div>
                      <span className="tnum">{p.mem}%</span>
                    </div>
                  </td>
                  <td><Badge tone={statusTone[p.status]}>{p.status}</Badge></td>
                  <td><Badge tone={priorityTone[p.priority]}>{p.priority}</Badge></td>
                  <td>
                    <div className="action-cell">
                      <Button size="sm" variant="ghost" onClick={() => setViewRow(p)}>
                        <i className="fa-solid fa-eye" /> View
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => endProcess(p.pid)}>
                        <i className="fa-solid fa-xmark" /> End
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="process-empty">No processes match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="process-pagination">
          <span className="page-info">Showing {pageRows.length} of {filtered.length} processes</span>
          <div className="page-controls">
            <Button size="sm" variant="ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} className={page === 1 ? 'opacity-50 pe-none' : ''}>
              <i className="fa-solid fa-arrow-left" /> Prev
            </Button>
            <span className="page-num">{page} / {totalPages}</span>
            <Button size="sm" variant="ghost" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className={page === totalPages ? 'opacity-50 pe-none' : ''}>
              Next <i className="fa-solid fa-arrow-right" />
            </Button>
          </div>
        </div>
      </div>

      {viewRow && <ProcessModal row={viewRow} onClose={() => setViewRow(null)} onKill={() => endProcess(viewRow.pid)} />}
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
    { k: 'Threads', v: `${(row.pid % 12) + 4}` },
    { k: 'Start Time', v: '08:14:22' },
    { k: 'CPU Time', v: '00:42:18' },
  ];
  return (
    <div className="process-modal-overlay">
      <div className="process-modal-backdrop" onClick={onClose} />
      <div className="process-modal">
        <div className="process-modal-header">
          <div className="d-flex align-items-center gap-3">
            <div className="modal-proc-avatar">{row.name.slice(0, 2)}</div>
            <div>
              <h3>{row.name}</h3>
              <div className="modal-sub">PID {row.pid} · {row.user}</div>
            </div>
          </div>
          <button className="profile-drawer-close" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="process-modal-grid">
          {fields.map((f) => (
            <div key={f.k} className="modal-field">
              <div className="modal-field-label">{f.k}</div>
              <div className="modal-field-value">{f.v}</div>
            </div>
          ))}
        </div>
        <div className="process-modal-footer">
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button variant="danger" onClick={onKill}><i className="fa-solid fa-xmark" /> End Process</Button>
        </div>
      </div>
    </div>
  );
}
