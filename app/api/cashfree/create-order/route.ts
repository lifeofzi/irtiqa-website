import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const CF_API_BASE = process.env.CASHFREE_ENV === 'production'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';

export async function POST(req: NextRequest) {
  try {
    const { productId, amount, buyerName, buyerEmail, buyerPhone, buyerAddress, size, returnUrl } = await req.json();

    if (!productId || !amount || !buyerName || !buyerEmail || !buyerAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Stock check
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: invRow } = await supabase
      .from('inventory')
      .select('stock')
      .eq('product_id', productId)
      .eq('size', size || '__none__')
      .maybeSingle();
    const stockLimit = invRow != null ? invRow.stock : 10;

    if (stockLimit === 0) {
      return NextResponse.json({ error: `Size ${size || 'selected'} is out of stock.` }, { status: 409 });
    }

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

    const orderId = `irtiqa_${productId.slice(-4)}_${Date.now()}`;

    const body: Record<string, unknown> = {
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: buyerEmail.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 50),
        customer_phone: buyerPhone || '9999999999',
        customer_name: buyerName,
        customer_email: buyerEmail,
      },
    };

    if (returnUrl) {
      body.order_meta = {
        return_url: `${returnUrl}&cf_order_id=${orderId}`,
      };
    }

    const cfRes = await fetch(`${CF_API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'x-client-id': process.env.CASHFREE_APP_ID!,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
        'x-api-version': '2023-08-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!cfRes.ok) {
      const errText = await cfRes.text();
      console.error('Cashfree create order failed:', cfRes.status, errText);
      return NextResponse.json({ error: 'Failed to create Cashfree order' }, { status: 502 });
    }

    const cfOrder = await cfRes.json();

    return NextResponse.json({
      orderId,
      cfOrderId: cfOrder.cf_order_id,
      paymentSessionId: cfOrder.payment_session_id,
      amount,
    });
  } catch (err) {
    console.error('Cashfree create-order error:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
