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
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inventory');
      const data = await res.json();
      setInventory(data.inventory || []);
      setEdits({});
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

  const hasChanges = Object.keys(edits).some(pid =>
    Object.keys(edits[pid]).length > 0
  );

  async function saveAll() {
    setSaving(true);
    try {
      const calls: Promise<Response>[] = [];
      for (const productId of Object.keys(edits)) {
        for (const size of Object.keys(edits[productId])) {
          calls.push(fetch('/api/admin/inventory', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, size, stock: edits[productId][size] }),
          }));
        }
      }
      const results = await Promise.all(calls);
      const failed = results.filter(r => !r.ok).length;
      if (failed > 0) flash(`${failed} update(s) failed`);
      else flash(`Saved — ${calls.length} change${calls.length !== 1 ? 's' : ''} updated`);
      load();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ color: '#f0f0f0', fontFamily: "'Courier New',monospace" }}>
      {toast && (
        <div style={{ position: 'fixed', top: 68, right: 24, background: '#c00000', color: '#fff', padding: '10px 20px', fontFamily: "'Courier New',monospace", fontSize: 11, letterSpacing: '0.2em', zIndex: 9999 }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 'bold', letterSpacing: '0.1em', color: '#c00000', marginBottom: 6 }}>INVENTORY</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}>
            Set stock limit per size — orders block when limit is reached.
          </div>
        </div>
        <button
          onClick={saveAll}
          disabled={saving || !hasChanges}
          style={{
            background: saving || !hasChanges ? 'rgba(192,0,0,0.15)' : '#c00000',
            color: saving || !hasChanges ? 'rgba(192,0,0,0.5)' : '#f0f0f0',
            border: `1px solid ${saving || !hasChanges ? 'rgba(192,0,0,0.2)' : '#c00000'}`,
            padding: '10px 28px',
            fontFamily: "'Courier New',monospace",
            fontSize: 10,
            letterSpacing: '0.4em',
            cursor: saving || !hasChanges ? 'default' : 'pointer',
            whiteSpace: 'nowrap' as const,
          }}
        >
          {saving ? '...' : 'SAVE CHANGES'}
        </button>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: 0, paddingBottom: 8, borderBottom: '1px solid rgba(192,0,0,0.15)', marginBottom: 4 }}>
                <div style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)' }}>SIZE / MODEL</div>
                <div style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)' }}>SOLD / REMAINING</div>
                <div style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)' }}>LIMIT</div>
              </div>

              {sizes.map(({ size, stock, sold }) => {
                const current = getStock(product.id, size, stock);
                const dirty = edits[product.id]?.[size] !== undefined && edits[product.id][size] !== stock;
                const remaining = current - sold;
                const remainColor = remaining <= 0 ? '#ff4444' : remaining <= 2 ? '#ff8800' : remaining <= 5 ? '#ffaa00' : '#00aa44';

                return (
                  <div key={size} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: 0, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 'bold', color: dirty ? '#fff' : '#f0f0f0', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {size}
                      {dirty && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#c00000', display: 'inline-block', flexShrink: 0 }} />}
                    </div>
                    <div style={{ fontSize: 12 }}>
                      <span style={{ color: '#f0f0f0' }}>{sold}</span>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}> sold</span>
                      <span style={{ color: remainColor, fontSize: 11 }}> · {remaining} left</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={9999}
                      value={current}
                      onChange={e => setStock(product.id, size, parseInt(e.target.value) || 0)}
                      style={{ background: dirty ? 'rgba(192,0,0,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${dirty ? 'rgba(192,0,0,0.6)' : 'rgba(192,0,0,0.3)'}`, color: '#f0f0f0', padding: '5px 8px', fontFamily: "'Courier New',monospace", fontSize: 13, width: 64, outline: 'none', textAlign: 'center', boxSizing: 'border-box' as const }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {!loading && hasChanges && (
        <div style={{ position: 'sticky', bottom: 24, display: 'flex', justifyContent: 'flex-end', pointerEvents: 'none' }}>
          <button
            onClick={saveAll}
            disabled={saving}
            style={{ background: '#c00000', color: '#f0f0f0', border: 'none', padding: '12px 32px', fontFamily: "'Courier New',monospace", fontSize: 10, letterSpacing: '0.4em', cursor: saving ? 'default' : 'pointer', pointerEvents: 'all', boxShadow: '0 4px 24px rgba(192,0,0,0.4)' }}
          >
            {saving ? '...' : 'SAVE CHANGES'}
          </button>
        </div>
      )}
    </div>
  );
}
