import { NextRequest, NextResponse } from 'next/server';
import { Cashfree, CFEnvironment } from 'cashfree-pg';
import { createClient } from '@supabase/supabase-js';

const cf = new Cashfree(
  process.env.CASHFREE_ENV === 'production' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID!,
  process.env.CASHFREE_SECRET_KEY!
);

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

    const response = await (cf as unknown as {
      PGCreateOrder: (req: unknown) => Promise<{ data: { cf_order_id: string; payment_session_id: string } }>
    }).PGCreateOrder({
      order_amount: amount,
      order_currency: 'INR',
      order_id: orderId,
      customer_details: {
        customer_id: buyerEmail.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 50),
        customer_phone: buyerPhone || '9999999999',
        customer_name: buyerName,
        customer_email: buyerEmail,
      },
      order_meta: returnUrl ? {
        return_url: `${returnUrl}&cf_order_id=${orderId}`,
      } : undefined,
    });

    return NextResponse.json({
      orderId,
      cfOrderId: response.data.cf_order_id,
      paymentSessionId: response.data.payment_session_id,
      amount,
    });
  } catch (err) {
    console.error('Cashfree create-order error:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
