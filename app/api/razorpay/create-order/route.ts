import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { productId, amount, buyerName, buyerEmail, buyerPhone, buyerAddress, size } = await req.json();

    if (!productId || !amount || !buyerName || !buyerEmail || !buyerAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get stock limit from inventory table, fall back to 10 only if row doesn't exist
    const { data: invRow } = await supabase
      .from('inventory')
      .select('stock')
      .eq('product_id', productId)
      .eq('size', size || '__none__')
      .maybeSingle();
    const stockLimit = invRow != null ? invRow.stock : 10;

    // Stock set to 0 — block immediately
    if (stockLimit === 0) {
      return NextResponse.json({ error: `Size ${size || 'selected'} is out of stock.` }, { status: 409 });
    }

    // Count paid/shipped/delivered orders for this product+size
    let countQuery = supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('product_id', productId)
      .in('status', ['paid', 'shipped', 'delivered']);

    if (size) countQuery = countQuery.eq('size', size);

    const { count } = await countQuery;

    if ((count ?? 0) >= stockLimit) {
      return NextResponse.json({ error: `Size ${size || 'selected'} is out of stock.` }, { status: 409 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${productId}_${Date.now()}`,
      notes: {
        productId,
        buyerName,
        buyerEmail,
        buyerPhone: buyerPhone || '',
        buyerAddress,
        size: size || '',
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error('Razorpay create-order error:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
