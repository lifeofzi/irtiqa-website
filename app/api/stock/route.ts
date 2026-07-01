import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get('productId');
  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });

  const db = sql();
  const [invRows, orders] = await Promise.all([
    db`SELECT size, stock FROM inventory WHERE product_id = ${productId}`,
    db`SELECT size FROM orders WHERE product_id = ${productId} AND status IN ('paid', 'shipped', 'delivered')`,
  ]);

  const sold: Record<string, number> = {};
  orders.forEach(o => {
    const s = o.size || '__none__';
    sold[s] = (sold[s] || 0) + 1;
  });

  const stockMap: Record<string, boolean> = {};
  invRows.forEach(row => {
    const soldCount = sold[row.size] || 0;
    stockMap[row.size] = row.stock === 0 || soldCount >= row.stock;
  });

  return NextResponse.json({ outOfStock: stockMap });
}
