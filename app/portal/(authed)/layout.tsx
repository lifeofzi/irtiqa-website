'use client';

import { useRouter, usePathname } from 'next/navigation';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/portal/login');
  }

  const tab = (label: string, path: string) => (
    <button
      key={path}
      onClick={() => router.push(path)}
      style={{
        background: 'none',
        border: 'none',
        borderBottom: `2px solid ${pathname === path ? '#c00000' : 'transparent'}`,
        color: pathname === path ? '#c00000' : 'rgba(255,255,255,0.4)',
        padding: '0 20px',
        height: 52,
        fontFamily: "'Courier New',monospace",
        fontSize: 10,
        letterSpacing: '0.35em',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#050505', fontFamily: "'Courier New',monospace" }}>
      <nav style={{ borderBottom: '1px solid rgba(192,0,0,0.2)', padding: '0 32px', display: 'flex', alignItems: 'center', height: 52, gap: 8 }}>
        <div style={{ color: '#c00000', fontSize: 15, fontWeight: 'bold', letterSpacing: '0.15em', marginRight: 'auto' }}>
          IRTIQA{' '}
          <span style={{ fontSize: 9, letterSpacing: '0.4em', color: 'rgba(255,255,255,0.25)', fontWeight: 'normal' }}>PORTAL</span>
        </div>
        {tab('ORDERS', '/portal/orders')}
        {tab('INVENTORY', '/portal/inventory')}
        <button
          onClick={logout}
          style={{ background: 'none', border: '1px solid rgba(192,0,0,0.25)', color: 'rgba(255,255,255,0.3)', padding: '5px 14px', fontFamily: "'Courier New',monospace", fontSize: 9, letterSpacing: '0.35em', cursor: 'pointer', marginLeft: 12 }}
        >
          LOG OUT
        </button>
      </nav>
      <main style={{ padding: '36px 32px', maxWidth: 1000, margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
}
