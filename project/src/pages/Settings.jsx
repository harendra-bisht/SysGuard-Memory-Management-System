/* ============================================================
   Settings.jsx
   Settings page: appearance, refresh interval, notification
   toggles, alert thresholds, export preferences, and
   profile fields.
   ============================================================ */

import { useState } from 'react';
import { Card, SectionTitle, Button } from '@/components/ui';
import { useTheme } from '@/lib/theme';

/* ---------- Toggle switch ---------- */
function Toggle({ on, onChange }) {
  return (
    <button className={`toggle-switch ${on ? 'on' : 'off'}`} onClick={() => onChange(!on)}>
      <span className="toggle-knob" />
    </button>
  );
}

export function SettingsPage() {
  const { theme, toggle } = useTheme();
  const [saved, setSaved] = useState(false);
  const [s, setS] = useState({
    refreshInterval: 5,
    notifPush: true,
    notifEmail: false,
    notifSound: true,
    thresholdCpu: 85,
    thresholdRam: 90,
    thresholdDisk: 95,
    thresholdBattery: 20,
    exportFormat: 'pdf',
    autoExport: false,
    profileName: 'Kai Anderson',
    profileEmail: 'kai@health-monitor.io',
    profileRole: 'Systems Administrator',
  });

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const notifRows = [
    { k: 'Push notifications', d: 'Show alerts in the browser', v: s.notifPush, key: 'notifPush' },
    { k: 'Email alerts', d: 'Send critical alerts to my inbox', v: s.notifEmail, key: 'notifEmail' },
    { k: 'Sound alerts', d: 'Play a chime on new alert', v: s.notifSound, key: 'notifSound' },
  ];

  const thresholds = [
    { k: 'CPU threshold', unit: '%', key: 'thresholdCpu' },
    { k: 'RAM threshold', unit: '%', key: 'thresholdRam' },
    { k: 'Disk threshold', unit: '%', key: 'thresholdDisk' },
    { k: 'Battery low', unit: '%', key: 'thresholdBattery' },
  ];

  const profileFields = [
    { k: 'Name', key: 'profileName', type: 'text' },
    { k: 'Email', key: 'profileEmail', type: 'email' },
    { k: 'Role', key: 'profileRole', type: 'text' },
  ];

  return (
    <div className="d-flex flex-column gap-4 animate-fade-in settings-wrap">
      <div className="settings-header">
        <h1>Settings</h1>
        <div className="sub">Customize System Health Dashboard to fit your workflow.</div>
      </div>

      {/* Appearance */}
      <Card>
        <SectionTitle icon={<i className="fa-solid fa-palette" />} title="Appearance" subtitle="Theme & display" />
        <div className="setting-row">
          <div>
            <div className="setting-label">Dark Mode</div>
            <div className="setting-desc">Switch between dark and light themes</div>
          </div>
          <Toggle on={theme === 'dark'} onChange={toggle} />
        </div>
      </Card>

      {/* Refresh interval */}
      <Card>
        <SectionTitle icon={<i className="fa-solid fa-rotate" />} title="Refresh Interval" subtitle="How often metrics update" />
        <div className="d-flex align-items-center gap-3">
          <input
            type="range" min={1} max={30} value={s.refreshInterval}
            onChange={(e) => setS({ ...s, refreshInterval: +e.target.value })}
            className="range-slider flex-grow-1"
          />
          <div style={{ width: 80, textAlign: 'right' }}>
            <span className="fs-5 fw-bold tnum text-white">{s.refreshInterval}</span>
            <span className="small text-secondary-muted ms-1">sec</span>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <SectionTitle icon={<i className="fa-solid fa-bell" />} title="Notification Settings" subtitle="How alerts reach you" />
        {notifRows.map((r) => (
          <div key={r.key} className="setting-row">
            <div>
              <div className="setting-label">{r.k}</div>
              <div className="setting-desc">{r.d}</div>
            </div>
            <Toggle on={r.v} onChange={(v) => setS({ ...s, [r.key]: v })} />
          </div>
        ))}
      </Card>

      {/* Thresholds */}
      <Card>
        <SectionTitle icon={<i className="fa-solid fa-gauge-high" />} title="Alert Thresholds" subtitle="When to trigger warnings" />
        <div className="row g-4">
          {thresholds.map((t) => (
            <div key={t.key} className="col-12 col-sm-6">
              <div className="d-flex justify-content-between small mb-2">
                <span className="text-secondary-muted">{t.k}</span>
                <span className="tnum fw-semibold text-white">{s[t.key]}{t.unit}</span>
              </div>
              <input
                type="range" min={0} max={100} value={s[t.key]}
                onChange={(e) => setS({ ...s, [t.key]: +e.target.value })}
                className="range-slider w-100"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Export preferences */}
      <Card>
        <SectionTitle icon={<i className="fa-solid fa-download" />} title="Export Preferences" subtitle="Default report format" />
        <div className="row g-3">
          <div className="col-12 col-sm-6">
            <label className="field-label">Default format</label>
            <select
              className="settings-select mt-1"
              value={s.exportFormat}
              onChange={(e) => setS({ ...s, exportFormat: e.target.value })}
            >
              {['pdf', 'csv', 'json'].map((f) => (
                <option key={f} value={f}>{f.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div className="col-12 col-sm-6 d-flex align-items-end">
            <div className="auto-export-row">
              <div>
                <div className="label">Auto-export daily</div>
                <div className="desc">Generate a report at midnight</div>
              </div>
              <Toggle on={s.autoExport} onChange={(v) => setS({ ...s, autoExport: v })} />
            </div>
          </div>
        </div>
      </Card>

      {/* Profile */}
      <Card>
        <SectionTitle icon={<i className="fa-solid fa-user" />} title="Profile Settings" subtitle="Your account details" />
        <div className="row g-3">
          {profileFields.map((f) => (
            <div key={f.key} className="col-12 col-sm-6">
              <label className="field-label">{f.k}</label>
              <input
                type={f.type}
                value={s[f.key]}
                onChange={(e) => setS({ ...s, [f.key]: e.target.value })}
                className="settings-input mt-1"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Save bar */}
      <div className="save-bar">
        <Button variant="ghost">Cancel</Button>
        <Button variant="primary" onClick={save}>
          <i className={`fa-solid ${saved ? 'fa-check' : 'fa-floppy-disk'}`} />
          {saved ? 'Saved' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
