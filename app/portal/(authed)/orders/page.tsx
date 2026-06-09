'use client';

import { useEffect, useState, useCallback } from 'react';

type StatusFilter = 'all' | 'paid' | 'shipped' | 'delivered';

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
  created_at: string;
}

const STATUS_COLORS: Record<string, React.CSSProperties> = {
  pending: { color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.2)' },
  paid:    { color: '#00aa44', borderColor: '#00aa44' },
  shipped: { color: '#c00000', borderColor: '#c00000' },
  delivered: { color: '#0088cc', borderColor: '#0088cc' },
};

export default function OrdersPage() {
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [working, setWorking] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?status=${filter}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3200);
  }

  async function patch(orderId: string, body: object) {
    setWorking(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, ...body }),
      });
      if (res.ok) {
        flash(body && 'status' in body && (body as { status: string }).status === 'shipped' ? 'Marked shipped — tracking email sent' : 'Updated');
        load();
      } else {
        const d = await res.json();
        flash(d.error || 'Error');
      }
    } finally {
      setWorking(null);
    }
  }

  const filters: StatusFilter[] = ['all', 'paid', 'shipped', 'delivered'];

  return (
    <div style={{ color: '#f0f0f0' }}>
      {toast && (
        <div style={{ position: 'fixed', top: 68, right: 24, background: '#c00000', color: '#fff', padding: '10px 20px', fontFamily: "'Courier New',monospace", fontSize: 11, letterSpacing: '0.2em', zIndex: 9999 }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 'bold', letterSpacing: '0.1em', color: '#c00000' }}>ORDERS</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.3em' }}>
          {orders.length} {filter !== 'all' ? filter : 'total'}
        </div>
      </div>

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
                  <span style={{ fontSize: 9, letterSpacing: '0.4em', padding: '3px 10px', border: '1px solid', ...(STATUS_COLORS[order.status] || STATUS_COLORS.pending) }}>
                    {order.status.toUpperCase()}
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
                  order.tracking_id ? ['Tracking', order.tracking_id] : null,
                ].filter((x): x is string[] => x !== null).map(([label, value]) => (
                  <div key={label as string}>
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', marginRight: 8 }}>{label}</span>
                    <span style={label === 'Tracking' ? { color: '#c00000' } : {}}>{value}</span>
                  </div>
                ))}
              </div>

              {order.status === 'paid' && (
                <div style={{ borderTop: '1px solid rgba(192,0,0,0.15)', paddingTop: 16, marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Tracking ID"
                    value={trackingInputs[order.razorpay_order_id] || ''}
                    onChange={e => setTrackingInputs(t => ({ ...t, [order.razorpay_order_id]: e.target.value }))}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(192,0,0,0.3)', color: '#f0f0f0', padding: '8px 12px', fontFamily: "'Courier New',monospace", fontSize: 12, flex: 1, minWidth: 200, outline: 'none' }}
                  />
                  <button
                    disabled={busy}
                    onClick={() => patch(order.razorpay_order_id, { status: 'shipped', trackingId: trackingInputs[order.razorpay_order_id]?.trim() })}
                    style={{ background: busy ? 'rgba(192,0,0,0.4)' : '#c00000', color: '#f0f0f0', border: 'none', padding: '8px 20px', fontFamily: "'Courier New',monospace", fontSize: 10, letterSpacing: '0.3em', cursor: busy ? 'default' : 'pointer', whiteSpace: 'nowrap' }}
                  >
                    {busy ? '...' : 'MARK SHIPPED'}
                  </button>
                </div>
              )}

              {order.status === 'shipped' && (
                <div style={{ borderTop: '1px solid rgba(192,0,0,0.15)', paddingTop: 16, marginTop: 16 }}>
                  <button
                    disabled={busy}
                    onClick={() => patch(order.razorpay_order_id, { status: 'delivered' })}
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
