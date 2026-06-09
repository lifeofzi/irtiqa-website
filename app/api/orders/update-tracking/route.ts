import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const { orderId, trackingId, adminKey } = await req.json();

    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!orderId || !trackingId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('buyer_email, buyer_name, product_name')
      .eq('razorpay_order_id', orderId)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update({ tracking_id: trackingId, status: 'shipped' })
      .eq('razorpay_order_id', orderId);

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY!);

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: order.buyer_email,
      subject: `Your order has shipped — ${order.product_name}`,
      html: `
        <div style="font-family: monospace; background: #050505; color: #f0f0f0; padding: 40px; max-width: 600px;">
          <h1 style="color: #c00000; letter-spacing: 0.1em; text-transform: uppercase; font-size: 28px;">IRTIQA</h1>
          <p style="color: rgba(255,255,255,0.6); font-size: 12px; letter-spacing: 0.3em; text-transform: uppercase; margin-top: 8px;">Order Shipped</p>
          <hr style="border: none; border-top: 1px solid rgba(192,0,0,0.3); margin: 24px 0;" />
          <p style="color: #f0f0f0;">Hi ${order.buyer_name},</p>
          <p style="color: rgba(255,255,255,0.7); line-height: 1.8;">Your order for <strong style="color: #f0f0f0;">${order.product_name}</strong> has shipped.</p>
          <div style="background: rgba(192,0,0,0.08); border: 1px solid rgba(192,0,0,0.2); padding: 20px; margin: 24px 0;">
            <p style="color: rgba(255,255,255,0.5); font-size: 11px; letter-spacing: 0.4em; text-transform: uppercase; margin-bottom: 12px;">Tracking</p>
            <p style="color: #c00000; font-size: 16px; letter-spacing: 0.1em;">${trackingId}</p>
          </div>
          <p style="color: rgba(255,255,255,0.6); font-size: 13px;">Use this tracking ID to follow your shipment.</p>
          <hr style="border: none; border-top: 1px solid rgba(192,0,0,0.2); margin: 24px 0;" />
          <p style="color: rgba(255,255,255,0.25); font-size: 11px; letter-spacing: 0.2em;">Ali Saffudin · IRTIQA · alisaffudin@gmail.com</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Update tracking error:', err);
    return NextResponse.json({ error: 'Failed to update tracking' }, { status: 500 });
  }
}
