'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.replace('/portal/orders');
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid credentials');
      }
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 340, padding: '48px 36px', border: '1px solid rgba(192,0,0,0.22)', background: 'rgba(192,0,0,0.03)' }}>
        <div style={{ fontFamily: "'Courier New',monospace", fontSize: 22, fontWeight: 'bold', letterSpacing: '0.1em', color: '#c00000', marginBottom: 2 }}>
          Ali Saffudin
        </div>
        <div style={{ fontFamily: "'Courier New',monospace", fontSize: 8, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.25)', marginBottom: 40, textTransform: 'uppercase' }}>
          Merch Portal
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
            autoComplete="email"
            style={inputStyle}
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            autoComplete="current-password"
            style={inputStyle}
          />
          {error && (
            <div style={{ color: '#ff4444', fontSize: 11, fontFamily: "'Courier New',monospace", letterSpacing: '0.1em' }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{ background: loading ? 'rgba(192,0,0,0.5)' : '#c00000', color: '#f0f0f0', border: 'none', padding: '11px 0', fontFamily: "'Courier New',monospace", fontSize: 11, letterSpacing: '0.4em', cursor: loading ? 'default' : 'pointer', marginTop: 8 }}
          >
            {loading ? '...' : 'ENTER'}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(192,0,0,0.3)',
  color: '#f0f0f0',
  padding: '10px 14px',
  fontFamily: "'Courier New',monospace",
  fontSize: 13,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};
