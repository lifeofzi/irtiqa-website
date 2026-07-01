import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { sql } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { productId, amount, buyerName, buyerEmail, buyerPhone, buyerAddress, size } = await req.json();

    if (!productId || !amount || !buyerName || !buyerEmail || !buyerAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = sql();
    const sizeKey = size || '__none__';

    const [invRows, countRows] = await Promise.all([
      db`SELECT stock FROM inventory WHERE product_id = ${productId} AND size = ${sizeKey}`,
      size
        ? db`SELECT COUNT(*)::int AS count FROM orders WHERE product_id = ${productId} AND size = ${size} AND status IN ('paid', 'shipped', 'delivered')`
        : db`SELECT COUNT(*)::int AS count FROM orders WHERE product_id = ${productId} AND status IN ('paid', 'shipped', 'delivered')`,
    ]);

    const stockLimit = invRows.length > 0 ? invRows[0].stock : 10;

    if (stockLimit === 0) {
      return NextResponse.json({ error: `Size ${size || 'selected'} is out of stock.` }, { status: 409 });
    }

    if ((countRows[0]?.count ?? 0) >= stockLimit) {
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
