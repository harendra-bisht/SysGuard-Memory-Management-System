/* ============================================================
   AIRecommendation.jsx
   Panel showing AI-generated system recommendations with
   suggested actions and expected improvements.
   ============================================================ */

import { Card, SectionTitle, Button, Badge } from './ui';
import { recommendations } from '@/lib/data';

export function AIRecommendation({ refreshing, onRefresh }) {
  const labelFor = (color) => {
    if (color === 'amber') return 'Warning';
    if (color === 'cyan') return 'Info';
    return 'Optimize';
  };

  return (
    <Card>
      <SectionTitle
        icon={<i className="fa-solid fa-robot" />}
        title="AI System Recommendations"
        subtitle="Generated from live telemetry"
        right={
          <Button size="sm" variant="primary" onClick={onRefresh}>
            <i className={`fa-solid fa-rotate ${refreshing ? 'fa-spin' : ''}`} />
            Refresh Analysis
          </Button>
        }
      />
      <div className="d-flex flex-column gap-3">
        {recommendations.map((r) => (
          <div key={r.id} className="ai-rec-card">
            <div className="rec-top">
              <div className={`rec-icon-box tone-bg-${r.color}`} style={{ borderColor: 'currentColor' }}>
                <i className={`fa-solid fa-${r.icon}`} />
              </div>
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2">
                  <h3 className="rec-title">{r.title}</h3>
                  <Badge tone={r.color}>{labelFor(r.color)}</Badge>
                </div>
                <p className="rec-desc">{r.description}</p>
                <div className="rec-detail-grid mt-2">
                  <div className="rec-detail action">
                    <span className="detail-label">Suggested action: </span>
                    <span className="detail-value">{r.action}</span>
                  </div>
                  <div className="rec-detail expected">
                    <span className="detail-label">Expected: </span>
                    <span className="detail-value">{r.improvement}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
