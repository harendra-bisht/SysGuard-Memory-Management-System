import { useState } from 'react';

export function Login({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const endpoint =
        mode === 'login'
          ? 'http://localhost:5000/api/login'
          : 'http://localhost:5000/api/register';

      const body =
        mode === 'login'
          ? {
              email,
              password,
            }
          : {
              username: name,
              email,
              password,
            };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      onLogin(data.user || data);
    } catch (err) {
      console.error('Login error:', err);

      if (err instanceof TypeError) {
        setError(
          'Unable to connect to the server. Make sure Flask is running on port 5000.'
        );
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: 'var(--bg-primary, #0b1118)',
        padding: '20px',
      }}
    >
      <div
        className="card p-4"
        style={{
          width: '100%',
          maxWidth: '430px',
          background: 'var(--card-bg, #111923)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
        }}
      >
        {/* Header */}
        <div
          style={{
            fontSize: '42px',
            marginBottom: '10px',
          }}
        >
          🛡️

          <h2 className="text-white fw-bold mb-1">
            System Health Dashboard
          </h2>

          <p className="text-secondary-muted mb-0">
            {mode === 'login'
              ? 'Sign in to monitor your system'
              : 'Create your monitoring account'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-danger py-2">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={submit}>
          {/* Name - Register only */}
          {mode === 'register' && (
            <div className="mb-3">
              <label className="field-label">
                Name
              </label>

              <input
                type="text"
                className="settings-input w-100 mt-1"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          {/* Email */}
          <div className="mb-3">
            <label className="field-label">
              Email
            </label>

            <input
              type="email"
              className="settings-input w-100 mt-1"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="field-label">
              Password
            </label>

            <input
              type="password"
              className="settings-input w-100 mt-1"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-2"
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : mode === 'login'
              ? 'Sign In'
              : 'Create Account'}
          </button>
        </form>

        {/* Login/Register switch */}
        <div className="text-center mt-4">
          <span className="text-secondary-muted">
            {mode === 'login'
              ? "Don't have an account? "
              : 'Already have an account? '}
          </span>

          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() => {
              setMode(
                mode === 'login'
                  ? 'register'
                  : 'login'
              );

              setError('');
            }}
          >
            {mode === 'login'
              ? 'Create account'
              : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}