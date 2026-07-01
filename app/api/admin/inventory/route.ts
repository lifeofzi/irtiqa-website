import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS } from '@/lib/products';
import { isAdminRequest } from '@/lib/admin-auth';
import { sql } from '@/lib/db';

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = sql();
  const [rows, orders] = await Promise.all([
    db`SELECT product_id, size, stock FROM inventory`,
    db`SELECT product_id, size FROM orders WHERE status IN ('paid', 'shipped', 'delivered')`,
  ]);

  const inv: Record<string, Record<string, number>> = {};
  rows.forEach(r => {
    if (!inv[r.product_id]) inv[r.product_id] = {};
    inv[r.product_id][r.size] = r.stock;
  });

  const sold: Record<string, Record<string, number>> = {};
  orders.forEach(o => {
    const size = o.size || '__none__';
    if (!sold[o.product_id]) sold[o.product_id] = {};
    sold[o.product_id][size] = (sold[o.product_id][size] || 0) + 1;
  });

  const missing: { product_id: string; size: string; stock: number }[] = [];
  for (const p of PRODUCTS) {
    for (const s of p.sizes) {
      if (inv[p.id]?.[s] === undefined) {
        missing.push({ product_id: p.id, size: s, stock: 10 });
      }
    }
  }
  if (missing.length > 0) {
    await Promise.all(
      missing.map(r =>
        db`INSERT INTO inventory (product_id, size, stock) VALUES (${r.product_id}, ${r.size}, ${r.stock}) ON CONFLICT (product_id, size) DO NOTHING`
      )
    );
    missing.forEach(r => {
      if (!inv[r.product_id]) inv[r.product_id] = {};
      inv[r.product_id][r.size] = r.stock;
    });
  }

  const inventory = PRODUCTS.map(p => ({
    product: { id: p.id, name: p.name, subtitle: p.subtitle, tag: p.tag },
    sizes: p.sizes.map(s => ({
      size: s,
      stock: inv[p.id]?.[s] ?? 10,
      sold: sold[p.id]?.[s] ?? 0,
    })),
  }));

  return NextResponse.json({ inventory });
}

export async function PUT(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { productId, size, stock } = await req.json();
    if (!productId || !size || stock == null) {
      return NextResponse.json({ error: 'productId, size, stock required' }, { status: 400 });
    }

    const db = sql();
    await db`
      INSERT INTO inventory (product_id, size, stock)
      VALUES (${productId}, ${size}, ${stock})
      ON CONFLICT (product_id, size) DO UPDATE SET stock = ${stock}
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Inventory PUT error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
