'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

type StatusFilter = 'all' | 'paid' | 'shipped' | 'delivered';

interface Stats {
  total: number;
  pending: number;
  paid: number;
  shipped: number;
  delivered: number;
  revenue: number;
}

interface Order {
  id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  product_name: string;
  product_price: number;
  size: string | null;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string | null;
  buyer_address: string;
  status: string;
  tracking_id: string | null;
  tracking_link: string | null;
  created_at: string;
}

const STATUS_COLORS: Record<string, React.CSSProperties> = {
  pending:   { color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.2)' },
  paid:      { color: '#00aa44', borderColor: '#00aa44' },
  shipped:   { color: '#c00000', borderColor: '#c00000' },
  delivered: { color: '#0088cc', borderColor: '#0088cc' },
};

export default function OrdersPage() {
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  // Ship modal state
  const [shipModal, setShipModal] = useState<Order | null>(null);
  const [trackingId, setTrackingId] = useState('');
  const [trackingLink, setTrackingLink] = useState('');
  const [shipping, setShipping] = useState(false);
  const trackingInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?status=${filter}`);
      const data = await res.json();
      setOrders(data.orders || []);
      if (data.stats) setStats(data.stats);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (shipModal) {
      setTrackingId('');
      setTrackingLink('');
      setTimeout(() => trackingInputRef.current?.focus(), 50);
    }
  }, [shipModal]);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3200);
  }

  async function confirmShip() {
    if (!shipModal) return;
    const id = trackingId.trim();
    if (!id) { trackingInputRef.current?.focus(); return; }
    setShipping(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: shipModal.razorpay_order_id, status: 'shipped', trackingId: id, trackingLink: trackingLink.trim() || undefined }),
      });
      if (res.ok) {
        setShipModal(null);
        flash('Marked shipped — tracking email sent to ' + shipModal.buyer_email);
        load();
      } else {
        const d = await res.json();
        flash(d.error || 'Error');
      }
    } finally {
      setShipping(false);
    }
  }

  async function markDelivered(orderId: string) {
    setWorking(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: 'delivered' }),
      });
      if (res.ok) { flash('Marked delivered'); load(); }
      else { const d = await res.json(); flash(d.error || 'Error'); }
    } finally { setWorking(null); }
  }

  const filters: StatusFilter[] = ['all', 'paid', 'shipped', 'delivered'];

  return (
    <div style={{ color: '#f0f0f0' }}>
      {toast && (
        <div style={{ position: 'fixed', top: 68, right: 24, background: '#c00000', color: '#fff', padding: '10px 20px', fontFamily: "'Courier New',monospace", fontSize: 11, letterSpacing: '0.2em', zIndex: 9999 }}>
          {toast}
        </div>
      )}

      {/* Ship modal */}
      {shipModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget) setShipModal(null); }}
        >
          <div style={{ background: '#0c0c0c', border: '1px solid rgba(192,0,0,0.35)', padding: '36px 32px', width: '100%', maxWidth: 480, fontFamily: "'Courier New',monospace" }}>
            <div style={{ fontSize: 11, letterSpacing: '0.4em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 6 }}>Mark Shipped</div>
            <div style={{ fontSize: 18, fontWeight: 'bold', color: '#f0f0f0', marginBottom: 2 }}>{shipModal.buyer_name}</div>
            <div style={{ fontSize: 12, color: '#c00000', marginBottom: 28 }}>
              {shipModal.product_name}{shipModal.size ? ` · ${shipModal.size}` : ''}
            </div>

            <div style={{ fontSize: 10, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>
              Tracking ID <span style={{ color: '#c00000' }}>*</span>
            </div>
            <input
              ref={trackingInputRef}
              type="text"
              placeholder="e.g. 1234567890"
              value={trackingId}
              onChange={e => setTrackingId(e.target.value)}
              onKeyDown={e => { if (e.key === 'Escape') setShipModal(null); }}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(192,0,0,0.4)', color: '#f0f0f0', padding: '10px 14px', fontFamily: "'Courier New',monospace", fontSize: 12, width: '100%', outline: 'none', boxSizing: 'border-box', marginBottom: 20 }}
            />

            <div style={{ fontSize: 10, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>
              Tracking Link <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'none' }}>(optional)</span>
            </div>
            <input
              type="url"
              placeholder="https://track.delhivery.com/..."
              value={trackingLink}
              onChange={e => setTrackingLink(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') confirmShip(); if (e.key === 'Escape') setShipModal(null); }}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(192,0,0,0.4)', color: '#f0f0f0', padding: '10px 14px', fontFamily: "'Courier New',monospace", fontSize: 12, width: '100%', outline: 'none', boxSizing: 'border-box', marginBottom: 8 }}
            />
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', marginBottom: 28 }}>
              Both will be in the email. Link shows as a "Track Your Order" button.
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={confirmShip}
                disabled={shipping || !trackingId.trim()}
                style={{ flex: 1, background: shipping || !trackingId.trim() ? 'rgba(192,0,0,0.4)' : '#c00000', color: '#f0f0f0', border: 'none', padding: '11px 0', fontFamily: "'Courier New',monospace", fontSize: 10, letterSpacing: '0.35em', cursor: shipping || !trackingId.trim() ? 'default' : 'pointer' }}
              >
                {shipping ? '...' : 'SEND & MARK SHIPPED'}
              </button>
              <button
                onClick={() => setShipModal(null)}
                style={{ background: 'none', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.35)', padding: '11px 20px', fontFamily: "'Courier New',monospace", fontSize: 10, letterSpacing: '0.3em', cursor: 'pointer' }}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ fontSize: 22, fontWeight: 'bold', letterSpacing: '0.1em', color: '#c00000', marginBottom: 24 }}>ORDERS</div>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Total Orders',   value: stats.total,                                    color: '#f0f0f0' },
            { label: 'Awaiting Ship',  value: stats.paid,                                     color: '#00aa44' },
            { label: 'Shipped',        value: stats.shipped,                                  color: '#c00000' },
            { label: 'Delivered',      value: stats.delivered,                                color: '#0088cc' },
            { label: 'Revenue',        value: `₹${stats.revenue.toLocaleString('en-IN')}`,   color: '#c00000' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ border: '1px solid rgba(192,0,0,0.18)', background: 'rgba(192,0,0,0.03)', padding: '16px 20px' }}>
              <div style={{ fontSize: 9, letterSpacing: '0.4em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 10 }}>{label}</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color, fontFamily: "'Courier New',monospace", lineHeight: 1 }}>{value}</div>
            </div>
          ))}
          <div style={{ border: '1px solid rgba(192,0,0,0.18)', background: 'rgba(192,0,0,0.03)', padding: '16px 20px' }}>
            <div style={{ fontSize: 9, letterSpacing: '0.4em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 12 }}>Breakdown</div>
            {(['paid', 'shipped', 'delivered'] as const).map(s => {
              const count = stats[s];
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              const barColor = s === 'paid' ? '#00aa44' : s === 'shipped' ? '#c00000' : '#0088cc';
              return (
                <div key={s} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em', marginBottom: 4 }}>
                    <span style={{ textTransform: 'uppercase' }}>{s}</span>
                    <span style={{ color: barColor }}>{count}</span>
                  </div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                    <div style={{ height: 3, width: `${pct}%`, background: barColor, borderRadius: 2, transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 4, marginBottom: 28, flexWrap: 'wrap' }}>
        {filters.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              background: filter === s ? 'rgba(192,0,0,0.12)' : 'none',
              border: `1px solid ${filter === s ? '#c00000' : 'rgba(192,0,0,0.22)'}`,
              color: filter === s ? '#c00000' : 'rgba(255,255,255,0.4)',
              padding: '5px 18px',
              fontFamily: "'Courier New',monospace",
              fontSize: 9,
              letterSpacing: '0.35em',
              cursor: 'pointer',
            }}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, letterSpacing: '0.3em', textAlign: 'center', padding: '60px 0' }}>Loading...</div>
      ) : orders.length === 0 ? (
        <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, letterSpacing: '0.3em', textAlign: 'center', padding: '60px 0' }}>
          No {filter === 'all' ? '' : filter + ' '}orders yet.
        </div>
      ) : (
        orders.map(order => {
          const busy = working === order.razorpay_order_id;
          return (
            <div key={order.id} style={{ border: '1px solid rgba(192,0,0,0.18)', background: 'rgba(192,0,0,0.03)', padding: 24, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 'bold', color: '#f0f0f0', marginBottom: 4 }}>{order.buyer_name}</div>
                  <div style={{ fontSize: 12, color: '#c00000' }}>
                    {order.product_name}{order.size ? ` · ${order.size}` : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 6 }}>₹{order.product_price}</div>
                  <span style={{ fontSize: 9, letterSpacing: '0.4em', padding: '3px 10px', border: '1px solid', ...(STATUS_COLORS[order.status ?? 'pending'] || STATUS_COLORS.pending) }}>
                    {(order.status ?? 'pending').toUpperCase()}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: '2.1' }}>
                {[
                  ['Email', order.buyer_email],
                  order.buyer_phone ? ['Phone', order.buyer_phone] : null,
                  ['Address', order.buyer_address],
                  ['Order ID', order.razorpay_order_id],
                  order.razorpay_payment_id ? ['Payment ID', order.razorpay_payment_id] : null,
                  ['Date', new Date(order.created_at).toLocaleString('en-IN')],
                  order.tracking_id ? ['Tracking ID', order.tracking_id] : null,
                  order.tracking_link ? ['Tracking Link', order.tracking_link] : null,
                ].filter((x): x is string[] => x !== null).map(([label, value]) => (
                  <div key={label}>
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', marginRight: 8 }}>{label}</span>
                    {label === 'Tracking Link'
                      ? <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: '#c00000', textDecoration: 'underline' }}>{value}</a>
                      : <span>{value}</span>
                    }
                  </div>
                ))}
              </div>

              {order.status === 'paid' && (
                <div style={{ borderTop: '1px solid rgba(192,0,0,0.15)', paddingTop: 16, marginTop: 16 }}>
                  <button
                    onClick={() => setShipModal(order)}
                    style={{ background: '#c00000', color: '#f0f0f0', border: 'none', padding: '9px 24px', fontFamily: "'Courier New',monospace", fontSize: 10, letterSpacing: '0.3em', cursor: 'pointer' }}
                  >
                    MARK SHIPPED
                  </button>
                </div>
              )}

              {order.status === 'shipped' && (
                <div style={{ borderTop: '1px solid rgba(192,0,0,0.15)', paddingTop: 16, marginTop: 16 }}>
                  <button
                    disabled={busy}
                    onClick={() => markDelivered(order.razorpay_order_id)}
                    style={{ background: 'rgba(0,136,204,0.12)', color: '#0088cc', border: '1px solid rgba(0,136,204,0.35)', padding: '8px 20px', fontFamily: "'Courier New',monospace", fontSize: 10, letterSpacing: '0.3em', cursor: busy ? 'default' : 'pointer' }}
                  >
                    {busy ? '...' : 'MARK DELIVERED'}
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
