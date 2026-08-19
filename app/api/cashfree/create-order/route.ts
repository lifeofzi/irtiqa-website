import { NextRequest, NextResponse } from 'next/server';

const CF_API_BASE = process.env.CASHFREE_ENV === 'production'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';

export async function POST(req: NextRequest) {
  try {
    const { productId, amount, buyerName, buyerEmail, buyerPhone, buyerAddress, buyerCity, buyerState, buyerPincode, size, returnUrl } = await req.json();

    if (!productId || !amount || !buyerName || !buyerEmail || !buyerAddress || !buyerCity || !buyerState || !buyerPincode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const orderId = `irtiqa_${productId.slice(-4)}_${Date.now()}`;

    const body: Record<string, unknown> = {
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: buyerEmail.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 50),
        customer_phone: (buyerPhone || '9999999999').replace(/\s+/g, ''),
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
      let cfErr: unknown;
      try { cfErr = JSON.parse(errText); } catch { cfErr = errText; }
      return NextResponse.json({ error: 'Failed to create Cashfree order', detail: cfErr, status: cfRes.status }, { status: 502 });
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
