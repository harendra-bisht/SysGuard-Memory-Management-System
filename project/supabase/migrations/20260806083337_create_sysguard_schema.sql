/*
# Create SysGuard monitoring database schema

This migration sets up the full database for the SysGuard system-monitoring
dashboard. The app is single-tenant (no sign-in screen), so all tables use
anon + authenticated policies with open access — the data is intentionally
shared/public within this single deployment.

## New Tables

1. `system_info`
   - Singleton configuration describing the monitored host.
   - Columns: os, hostname, processor, architecture, total_ram,
     total_storage, ip, uptime, updated_at.

2. `processes`
   - Snapshot of currently running processes with resource usage.
   - Columns: pid, name, cpu, mem, status, priority, user, created_at.
   - Unique constraint on `pid` so re-inserts update the same row.

3. `notifications`
   - Alert messages surfaced in the dashboard notification panel.
   - Columns: title, message, tone, unread, created_at.

4. `recommendations`
   - AI-generated optimization suggestions.
   - Columns: title, icon, color, description, action, improvement,
     created_at.

5. `quick_actions`
   - Reference list of shortcut actions shown on the dashboard.
   - Columns: label, icon, color.

6. `metric_samples`
   - Time-series of system metrics (cpu, ram, disk, net, battery, health)
     sampled periodically. Powers the dashboard charts and analytics views.
   - Columns: cpu, ram, disk, net, battery, health, created_at.
   - Index on created_at for efficient time-range queries.

## Security

- Row Level Security enabled on every table.
- All policies use `TO anon, authenticated` with `USING (true)` / open
  WITH CHECK, because this is a single-tenant app with no sign-in screen
  and the data is intentionally shared/public.
- Four separate policies per table (select / insert / update / delete).
*/

-- =========================================================
-- system_info
-- =========================================================
CREATE TABLE IF NOT EXISTS system_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  os text NOT NULL,
  hostname text NOT NULL,
  processor text NOT NULL,
  architecture text NOT NULL,
  total_ram text NOT NULL,
  total_storage text NOT NULL,
  ip text NOT NULL,
  uptime text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE system_info ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_system_info" ON system_info;
CREATE POLICY "anon_select_system_info" ON system_info
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_system_info" ON system_info;
CREATE POLICY "anon_insert_system_info" ON system_info
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_system_info" ON system_info;
CREATE POLICY "anon_update_system_info" ON system_info
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_system_info" ON system_info;
CREATE POLICY "anon_delete_system_info" ON system_info
  FOR DELETE TO anon, authenticated USING (true);

-- =========================================================
-- processes
-- =========================================================
CREATE TABLE IF NOT EXISTS processes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pid integer NOT NULL UNIQUE,
  name text NOT NULL,
  cpu double precision NOT NULL DEFAULT 0,
  mem double precision NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Running',
  priority text NOT NULL DEFAULT 'Normal',
  "user" text NOT NULL DEFAULT 'system',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_processes_pid ON processes (pid);

ALTER TABLE processes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_processes" ON processes;
CREATE POLICY "anon_select_processes" ON processes
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_processes" ON processes;
CREATE POLICY "anon_insert_processes" ON processes
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_processes" ON processes;
CREATE POLICY "anon_update_processes" ON processes
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_processes" ON processes;
CREATE POLICY "anon_delete_processes" ON processes
  FOR DELETE TO anon, authenticated USING (true);

-- =========================================================
-- notifications
-- =========================================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  tone text NOT NULL DEFAULT 'cyan',
  unread boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications (created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_notifications" ON notifications;
CREATE POLICY "anon_select_notifications" ON notifications
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_notifications" ON notifications;
CREATE POLICY "anon_insert_notifications" ON notifications
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_notifications" ON notifications;
CREATE POLICY "anon_update_notifications" ON notifications
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_notifications" ON notifications;
CREATE POLICY "anon_delete_notifications" ON notifications
  FOR DELETE TO anon, authenticated USING (true);

-- =========================================================
-- recommendations
-- =========================================================
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  icon text NOT NULL DEFAULT 'microchip',
  color text NOT NULL DEFAULT 'cyan',
  description text NOT NULL,
  action text NOT NULL,
  improvement text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_recommendations" ON recommendations;
CREATE POLICY "anon_select_recommendations" ON recommendations
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_recommendations" ON recommendations;
CREATE POLICY "anon_insert_recommendations" ON recommendations
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_recommendations" ON recommendations;
CREATE POLICY "anon_update_recommendations" ON recommendations
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_recommendations" ON recommendations;
CREATE POLICY "anon_delete_recommendations" ON recommendations
  FOR DELETE TO anon, authenticated USING (true);

-- =========================================================
-- quick_actions
-- =========================================================
CREATE TABLE IF NOT EXISTS quick_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  icon text NOT NULL,
  color text NOT NULL DEFAULT 'cyan'
);

ALTER TABLE quick_actions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_quick_actions" ON quick_actions;
CREATE POLICY "anon_select_quick_actions" ON quick_actions
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_quick_actions" ON quick_actions;
CREATE POLICY "anon_insert_quick_actions" ON quick_actions
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_quick_actions" ON quick_actions;
CREATE POLICY "anon_update_quick_actions" ON quick_actions
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_quick_actions" ON quick_actions;
CREATE POLICY "anon_delete_quick_actions" ON quick_actions
  FOR DELETE TO anon, authenticated USING (true);

-- =========================================================
-- metric_samples
-- =========================================================
CREATE TABLE IF NOT EXISTS metric_samples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cpu double precision NOT NULL DEFAULT 0,
  ram double precision NOT NULL DEFAULT 0,
  disk double precision NOT NULL DEFAULT 0,
  net double precision NOT NULL DEFAULT 0,
  battery double precision NOT NULL DEFAULT 100,
  health double precision NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_metric_samples_created_at ON metric_samples (created_at DESC);

ALTER TABLE metric_samples ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_metric_samples" ON metric_samples;
CREATE POLICY "anon_select_metric_samples" ON metric_samples
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_metric_samples" ON metric_samples;
CREATE POLICY "anon_insert_metric_samples" ON metric_samples
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_metric_samples" ON metric_samples;
CREATE POLICY "anon_update_metric_samples" ON metric_samples
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_metric_samples" ON metric_samples;
CREATE POLICY "anon_delete_metric_samples" ON metric_samples
  FOR DELETE TO anon, authenticated USING (true);

-- =========================================================
-- Seed reference data from the dashboard mock values
-- =========================================================

INSERT INTO system_info (os, hostname, processor, architecture, total_ram, total_storage, ip, uptime)
SELECT 'Ubuntu 24.04 LTS', 'sysguard-node-01', 'Intel Core i7-12700H @ 2.30GHz',
       'x86_64 (12 cores, 20 threads)', '32.0 GiB DDR5', '1.0 TB NVMe SSD',
       '10.0.42.18', '14d 6h 32m'
WHERE NOT EXISTS (SELECT 1 FROM system_info);

INSERT INTO processes (pid, name, cpu, mem, status, priority, "user")
VALUES
  (1048, 'chrome.exe', 18.2, 14.6, 'Running', 'High', 'kai'),
  (2231, 'Code.exe', 9.4, 11.2, 'Running', 'Normal', 'kai'),
  (3092, 'Spotify.exe', 3.1, 4.8, 'Running', 'Low', 'kai'),
  (4120, 'Discord.exe', 2.2, 6.1, 'Running', 'Normal', 'kai'),
  (558, 'node.exe', 6.7, 8.9, 'Running', 'High', 'kai'),
  (872, 'python3', 4.3, 5.4, 'Running', 'Normal', 'system'),
  (12, 'kernel_task', 1.1, 2.1, 'Running', 'Critical', 'root'),
  (990, 'dockerd', 5.6, 7.3, 'Running', 'High', 'root'),
  (1450, 'mongod', 2.8, 9.2, 'Running', 'Normal', 'system'),
  (2103, 'postgres', 1.9, 6.7, 'Sleeping', 'Normal', 'postgres'),
  (3210, 'nginx', 0.8, 1.4, 'Sleeping', 'Low', 'www-data'),
  (441, 'sshd', 0.1, 0.6, 'Idle', 'Normal', 'root'),
  (7788, 'ffmpeg', 12.4, 3.2, 'Running', 'High', 'kai'),
  (332, 'WindowServer', 3.7, 4.1, 'Running', 'Critical', 'root'),
  (6612, 'slack', 2.5, 5.8, 'Running', 'Normal', 'kai'),
  (909, 'cron', 0.0, 0.2, 'Idle', 'Low', 'root'),
  (5530, 'notion', 1.6, 3.9, 'Running', 'Low', 'kai'),
  (7741, 'figma', 4.1, 6.2, 'Running', 'Normal', 'kai')
ON CONFLICT (pid) DO NOTHING;

INSERT INTO notifications (title, message, tone, unread)
VALUES
  ('High CPU Usage', 'CPU exceeded 85% for 60s', 'amber', true),
  ('Battery Low', 'Battery at 18% — connect charger', 'rose', true),
  ('Disk Nearly Full', 'Volume C: has 9% free space', 'cyan', true),
  ('Network Spike Detected', 'Inbound 340 Mbps on eth0', 'emerald', false),
  ('Process Crashed', 'ffmpeg exited with code 137', 'rose', false)
ON CONFLICT DO NOTHING;

INSERT INTO recommendations (title, icon, color, description, action, improvement)
VALUES
  ('CPU Usage is High', 'microchip', 'amber',
   'Google Chrome is consuming excessive CPU.',
   'Close inactive tabs to improve performance.',
   'Approximately 20% CPU reduction.'),
  ('Memory Pressure Building', 'memory', 'cyan',
   'VS Code + Docker together exceed 40% of RAM.',
   'Pause unused Docker containers during coding sessions.',
   'Approximately 15% memory headroom freed.'),
  ('Disk I/O Bottleneck', 'hard-drive', 'emerald',
   'mongod sustained high write latency for 12 min.',
   'Schedule a compaction or move the journal to an SSD volume.',
   'Up to 35% faster query response.')
ON CONFLICT DO NOTHING;

INSERT INTO quick_actions (label, icon, color)
VALUES
  ('Refresh System', 'rotate', 'cyan'),
  ('Optimize Memory', 'wand-magic-sparkles', 'emerald'),
  ('Generate Report', 'file-lines', 'blue'),
  ('Scan Processes', 'satellite-dish', 'amber'),
  ('Export Data', 'download', 'violet'),
  ('Restart Monitoring', 'arrow-rotate-left', 'rose')
ON CONFLICT DO NOTHING;
