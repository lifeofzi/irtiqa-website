import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get('productId');
  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [{ data: invRows }, { data: orders }] = await Promise.all([
    supabase.from('inventory').select('size, stock').eq('product_id', productId),
    supabase
      .from('orders')
      .select('size')
      .eq('product_id', productId)
      .in('status', ['paid', 'shipped', 'delivered']),
  ]);

  // Count sold per size
  const sold: Record<string, number> = {};
  orders?.forEach(o => {
    const s = o.size || '__none__';
    sold[s] = (sold[s] || 0) + 1;
  });

  // Build map: size → out of stock bool
  const stockMap: Record<string, boolean> = {};
  invRows?.forEach(row => {
    const soldCount = sold[row.size] || 0;
    stockMap[row.size] = row.stock === 0 || soldCount >= row.stock;
  });

  return NextResponse.json({ outOfStock: stockMap });
}
