'use client';

import { useEffect, useState } from 'react';

interface SizeRow { size: string; stock: number; sold: number }
interface ProductInv {
  product: { id: string; name: string; subtitle: string; tag: string };
  sizes: SizeRow[];
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<ProductInv[]>([]);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState<Record<string, Record<string, number>>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inventory');
      const data = await res.json();
      setInventory(data.inventory || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3200);
  }

  function getStock(productId: string, size: string, fallback: number) {
    return edits[productId]?.[size] ?? fallback;
  }

  function setStock(productId: string, size: string, val: number) {
    setEdits(e => ({ ...e, [productId]: { ...(e[productId] || {}), [size]: val } }));
  }

  async function save(productId: string, size: string, stock: number) {
    const key = `${productId}:${size}`;
    setSaving(key);
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, size, stock }),
      });
      if (res.ok) { flash(`Saved — ${size}: ${stock} units`); load(); }
      else { const d = await res.json(); flash(d.error || 'Error'); }
    } finally { setSaving(null); }
  }

  return (
    <div style={{ color: '#f0f0f0', fontFamily: "'Courier New',monospace" }}>
      {toast && (
        <div style={{ position: 'fixed', top: 68, right: 24, background: '#c00000', color: '#fff', padding: '10px 20px', fontFamily: "'Courier New',monospace", fontSize: 11, letterSpacing: '0.2em', zIndex: 9999 }}>
          {toast}
        </div>
      )}

      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 22, fontWeight: 'bold', letterSpacing: '0.1em', color: '#c00000', marginBottom: 6 }}>INVENTORY</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}>
          Set stock limit per size — orders block when limit is reached.
        </div>
      </div>

      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, letterSpacing: '0.3em', textAlign: 'center', padding: '60px 0' }}>Loading...</div>
      ) : (
        inventory.map(({ product, sizes }) => (
          <div key={product.id} style={{ border: '1px solid rgba(192,0,0,0.18)', background: 'rgba(192,0,0,0.03)', padding: 24, marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 'bold', color: '#f0f0f0', marginBottom: 3 }}>{product.name}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 20 }}>
              {product.subtitle}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {/* Header row */}
              <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 160px', gap: 0, paddingBottom: 8, borderBottom: '1px solid rgba(192,0,0,0.15)', marginBottom: 4 }}>
                <div style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)' }}>SIZE</div>
                <div style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)' }}>SOLD / REMAINING</div>
                <div style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)' }}>STOCK LIMIT</div>
              </div>

              {sizes.map(({ size, stock, sold }) => {
                const current = getStock(product.id, size, stock);
                const remaining = current - sold;
                const key = `${product.id}:${size}`;
                const remainColor = remaining <= 0 ? '#ff4444' : remaining <= 2 ? '#ff8800' : remaining <= 5 ? '#ffaa00' : '#00aa44';

                return (
                  <div key={size} style={{ display: 'grid', gridTemplateColumns: '48px 1fr 160px', gap: 0, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 'bold', color: '#f0f0f0' }}>{size}</div>
                    <div style={{ fontSize: 12 }}>
                      <span style={{ color: '#f0f0f0' }}>{sold}</span>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}> sold</span>
                      <span style={{ color: remainColor, fontSize: 11 }}> · {remaining} left</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        type="number"
                        min={0}
                        max={9999}
                        value={current}
                        onChange={e => setStock(product.id, size, parseInt(e.target.value) || 0)}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(192,0,0,0.3)', color: '#f0f0f0', padding: '5px 8px', fontFamily: "'Courier New',monospace", fontSize: 13, width: 64, outline: 'none', textAlign: 'center', boxSizing: 'border-box' }}
                      />
                      <button
                        disabled={saving === key}
                        onClick={() => save(product.id, size, current)}
                        style={{ background: saving === key ? 'rgba(192,0,0,0.08)' : 'rgba(192,0,0,0.12)', color: saving === key ? 'rgba(192,0,0,0.5)' : '#c00000', border: '1px solid rgba(192,0,0,0.28)', padding: '5px 12px', fontFamily: "'Courier New',monospace", fontSize: 9, letterSpacing: '0.3em', cursor: saving === key ? 'default' : 'pointer' }}
                      >
                        {saving === key ? '...' : 'SAVE'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
