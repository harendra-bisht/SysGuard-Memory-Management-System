/* ============================================================
   ui.jsx
   Small reusable UI primitives: Card, SectionTitle, Button,
   ProgressBar, Badge, Spinner.
   ============================================================ */

import React from 'react';

/* ---------- Glassmorphism card ---------- */
export function Card({ children, className = '', ...rest }) {
  return (
    <div className={`card-base ${className}`} {...rest}>
      {children}
    </div>
  );
}

/* ---------- Section title with icon + subtitle ---------- */
export function SectionTitle({ icon, title, subtitle, right }) {
  return (
    <div className="section-title">
      <div className="left">
        {icon && <div className="icon-box">{icon}</div>}
        <div>
          <h2>{title}</h2>
          {subtitle && <div className="subtitle">{subtitle}</div>}
        </div>
      </div>
      {right}
    </div>
  );
}

/* ---------- Button ---------- */
export function Button({ children, onClick, variant = 'ghost', size = 'md', className = '', type = 'button' }) {
  const sizeCls = size === 'sm' ? 'btn-sm' : 'btn-md';
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn-app btn-${variant} ${sizeCls} ${className}`}
    >
      {children}
    </button>
  );
}

/* ---------- Progress bar ---------- */
export function ProgressBar({ value, tone = 'cyan' }) {
  const pct = Math.max(2, Math.min(100, value));
  return (
    <div className="progress-app">
      <div className={`progress-fill fill-${tone}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ---------- Badge ---------- */
export function Badge({ children, tone = 'slate' }) {
  return <span className={`badge-app tone-${tone}`}>{children}</span>;
}

/* ---------- Spinner ---------- */
export function Spinner() {
  return <span className="spinner-app" />;
}
