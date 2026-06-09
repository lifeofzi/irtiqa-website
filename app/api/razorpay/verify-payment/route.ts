import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      productId,
      productName,
      amount,
      buyerName,
      buyerEmail,
      buyerPhone,
      buyerAddress,
      size,
    } = await req.json();

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: dbError } = await supabase.from('orders').insert({
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      product_id: productId,
      product_name: productName,
      product_price: amount,
      size: size || null,
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      buyer_phone: buyerPhone || null,
      buyer_address: buyerAddress,
      status: 'paid',
    });

    if (dbError) {
      console.error('Supabase insert error:', dbError);
      return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
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
            <p style="color: #f0f0f0; font-size: 15px; font-weight: bold; margin: 0 0 16px; letter-spacing: 0.05em;">${razorpayOrderId}</p>
            <p style="color: #f0f0f0; margin: 4px 0;">Product: ${productName}</p>
            ${size ? `<p style="color: #f0f0f0; margin: 4px 0;">Size: ${size}</p>` : ''}
            <p style="color: #f0f0f0; margin: 4px 0;">Amount: ₹${amount}</p>
            <p style="color: rgba(255,255,255,0.4); margin: 12px 0 0; font-size: 11px;">Payment ID: ${razorpayPaymentId}</p>
          </div>
          <p style="color: rgba(255,255,255,0.6); font-size: 13px;">We'll send you a tracking ID once your order ships.</p>
          <hr style="border: none; border-top: 1px solid rgba(192,0,0,0.2); margin: 24px 0;" />
          <p style="color: rgba(255,255,255,0.25); font-size: 11px; letter-spacing: 0.2em;">Ali Saffudin · IRTIQA · alisaffudin@gmail.com</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, orderId: razorpayOrderId });
  } catch (err) {
    console.error('Verify payment error:', err);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
