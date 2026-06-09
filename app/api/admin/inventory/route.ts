import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PRODUCTS } from '@/lib/products';
import { isAdminRequest } from '@/lib/admin-auth';

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = db();
  const [{ data: rows }, { data: orders }] = await Promise.all([
    supabase.from('inventory').select('product_id, size, stock'),
    supabase.from('orders').select('product_id, size').in('status', ['paid', 'shipped', 'delivered']),
  ]);

  const inv: Record<string, Record<string, number>> = {};
  rows?.forEach(r => {
    if (!inv[r.product_id]) inv[r.product_id] = {};
    inv[r.product_id][r.size] = r.stock;
  });

  const sold: Record<string, Record<string, number>> = {};
  orders?.forEach(o => {
    const size = o.size || '__none__';
    if (!sold[o.product_id]) sold[o.product_id] = {};
    sold[o.product_id][size] = (sold[o.product_id][size] || 0) + 1;
  });

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

  const { productId, size, stock } = await req.json();
  if (!productId || !size || stock == null) {
    return NextResponse.json({ error: 'productId, size, stock required' }, { status: 400 });
  }

  const { error } = await db()
    .from('inventory')
    .upsert({ product_id: productId, size, stock }, { onConflict: 'product_id,size' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
