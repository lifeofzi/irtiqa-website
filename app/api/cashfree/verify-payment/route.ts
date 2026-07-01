import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { PRODUCTS } from '@/lib/products';
import { createPrintroveOrder } from '@/lib/printrove';
import { sql } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const {
      orderId,
      productId,
      productName,
      amount,
      buyerName,
      buyerEmail,
      buyerPhone,
      buyerAddress,
      buyerCity,
      buyerState,
      buyerPincode,
      size,
    } = await req.json();

    if (!orderId || !productId || !buyerEmail || !buyerName || !buyerAddress || !buyerCity || !buyerState || !buyerPincode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const apiBase = process.env.CASHFREE_ENV === 'production'
      ? 'https://api.cashfree.com/pg'
      : 'https://sandbox.cashfree.com/pg';

    const cfRes = await fetch(`${apiBase}/orders/${orderId}`, {
      headers: {
        'x-client-id': process.env.CASHFREE_APP_ID!,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
        'x-api-version': '2023-08-01',
        'Content-Type': 'application/json',
      },
    });

    if (!cfRes.ok) {
      const errBody = await cfRes.text();
      console.error('Cashfree order fetch failed:', errBody);
      return NextResponse.json({ error: 'Failed to verify payment with Cashfree' }, { status: 502 });
    }

    const cfOrder = await cfRes.json();

    if (cfOrder.order_status !== 'PAID') {
      return NextResponse.json(
        { error: `Payment not completed. Status: ${cfOrder.order_status}` },
        { status: 400 }
      );
    }

    const cfOrderId: string = cfOrder.cf_order_id ?? orderId;
    const db = sql();

    try {
      await db`
        INSERT INTO orders (
          razorpay_order_id, razorpay_payment_id, product_id, product_name,
          product_price, size, buyer_name, buyer_email, buyer_phone, buyer_address, status
        ) VALUES (
          ${orderId}, ${cfOrderId}, ${productId}, ${productName},
          ${amount}, ${size || null}, ${buyerName}, ${buyerEmail},
          ${buyerPhone || null}, ${`${buyerAddress}, ${buyerCity}, ${buyerState} - ${buyerPincode}`}, 'paid'
        )
      `;
    } catch (err: any) {
      if (err.code === '23505') {
        return NextResponse.json({ success: true, orderId });
      }
      console.error('DB insert error:', err);
      return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
    }

    const product = PRODUCTS.find(p => p.id === productId);
    if (product && size) {
      const variantId = product.printroveVariantIds[size];
      if (variantId) {
        createPrintroveOrder({
          referenceNumber: orderId,
          retailPrice: amount,
          customer: {
            name: buyerName,
            email: buyerEmail,
            phone: buyerPhone || '',
            address1: buyerAddress,
            city: buyerCity,
            state: buyerState,
            pincode: buyerPincode,
          },
          printroveProductId: product.printroveProductId,
          variantId,
        }).then(result => {
          if (!result.success) {
            console.error(`Printrove order failed for ${orderId}:`, result.error);
          } else {
            console.log(`Printrove order created for ${orderId}: #${result.printroveOrderId}`);
          }
        }).catch(err => {
          console.error(`Printrove order error for ${orderId}:`, err);
        });
      } else {
        console.error(`No Printrove variant found for product=${productId} size=${size}`);
      }
    }

    const resend = new Resend(process.env.RESEND_API_KEY!);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: buyerEmail,
      bcc: ['zaman.ishtiyaq@gmail.com', 'alisaffudin@gmail.com'],
      subject: `Order confirmed — ${productName}`,
      html: `
        <div style="font-family: monospace; background: #050505; color: #f0f0f0; padding: 40px; max-width: 600px;">
          <h1 style="color: #c00000; letter-spacing: 0.1em; text-transform: uppercase; font-size: 28px;">IRTIQA</h1>
          <p style="color: rgba(255,255,255,0.6); font-size: 12px; letter-spacing: 0.3em; text-transform: uppercase; margin-top: 8px;">Order Confirmed</p>
          <hr style="border: none; border-top: 1px solid rgba(192,0,0,0.3); margin: 24px 0;" />
          <p style="color: #f0f0f0;">Hi ${buyerName},</p>
          <p style="color: rgba(255,255,255,0.7); line-height: 1.8;">Your order for <strong style="color: #f0f0f0;">${productName}</strong> has been confirmed.</p>
          <div style="background: rgba(192,0,0,0.08); border: 1px solid rgba(192,0,0,0.2); padding: 20px; margin: 24px 0;">
            <p style="color: rgba(255,255,255,0.5); font-size: 11px; letter-spacing: 0.4em; text-transform: uppercase; margin-bottom: 12px;">Order Details</p>
            <p style="color: #c00000; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; margin: 0 0 4px;">Order ID</p>
            <p style="color: #f0f0f0; font-size: 15px; font-weight: bold; margin: 0 0 16px; letter-spacing: 0.05em;">${orderId}</p>
            <p style="color: #f0f0f0; margin: 4px 0;">Product: ${productName}</p>
            ${size ? `<p style="color: #f0f0f0; margin: 4px 0;">Size / Model: ${size}</p>` : ''}
            <p style="color: #f0f0f0; margin: 4px 0;">Amount: ₹${amount}</p>
            <p style="color: #f0f0f0; margin: 4px 0;">Shipping to: ${buyerAddress}, ${buyerCity}, ${buyerState} - ${buyerPincode}</p>
          </div>
          <p style="color: rgba(255,255,255,0.6); font-size: 13px;">We'll send you a tracking ID once your order ships.</p>
          <hr style="border: none; border-top: 1px solid rgba(192,0,0,0.2); margin: 24px 0;" />
          <p style="color: rgba(255,255,255,0.25); font-size: 11px; letter-spacing: 0.2em;">Ali Saffudin · IRTIQA · alisaffudin@gmail.com</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, orderId });
  } catch (err) {
    console.error('Cashfree verify-payment error:', err);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
