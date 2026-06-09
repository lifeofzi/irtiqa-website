import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { isAdminRequest } from '@/lib/admin-auth';

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const status = req.nextUrl.searchParams.get('status');
  const supabase = db();

  const [filteredResult, allResult] = await Promise.all([
    (() => {
      let q = supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (status && status !== 'all') q = q.eq('status', status);
      return q;
    })(),
    supabase.from('orders').select('status, product_price'),
  ]);

  if (filteredResult.error) return NextResponse.json({ error: filteredResult.error.message }, { status: 500 });

  const all = allResult.data || [];
  const stats = {
    total: all.length,
    pending: all.filter(o => o.status === 'pending').length,
    paid: all.filter(o => o.status === 'paid').length,
    shipped: all.filter(o => o.status === 'shipped').length,
    delivered: all.filter(o => o.status === 'delivered').length,
    revenue: all
      .filter(o => ['paid', 'shipped', 'delivered'].includes(o.status))
      .reduce((sum, o) => sum + (o.product_price || 0), 0),
  };

  return NextResponse.json({ orders: filteredResult.data, stats });
}

export async function PATCH(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { orderId, status, trackingId } = await req.json();
  if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 });

  const supabase = db();
  const updates: Record<string, string> = {};
  if (status) updates.status = status;
  if (trackingId) updates.tracking_id = trackingId;

  if (!Object.keys(updates).length) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });

  const { error } = await supabase.from('orders').update(updates).eq('razorpay_order_id', orderId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (status === 'shipped' && trackingId) {
    const { data: order } = await supabase
      .from('orders')
      .select('buyer_email, buyer_name, product_name')
      .eq('razorpay_order_id', orderId)
      .single();

    if (order) {
      const resend = new Resend(process.env.RESEND_API_KEY!);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: order.buyer_email,
        bcc: ['zaman.ishtiyaq@gmail.com', 'alisaffudin@gmail.com'],
        subject: `Your order has shipped — ${order.product_name}`,
        html: `
          <div style="font-family:monospace;background:#050505;color:#f0f0f0;padding:40px;max-width:600px;">
            <h1 style="color:#c00000;letter-spacing:.1em;text-transform:uppercase;font-size:28px;">IRTIQA</h1>
            <p style="color:rgba(255,255,255,.6);font-size:12px;letter-spacing:.3em;text-transform:uppercase;margin-top:8px;">Your order is on the way</p>
            <hr style="border:none;border-top:1px solid rgba(192,0,0,.3);margin:24px 0;" />
            <p style="color:#f0f0f0;">Hi ${order.buyer_name},</p>
            <p style="color:rgba(255,255,255,.7);line-height:1.8;">Your order for <strong style="color:#f0f0f0;">${order.product_name}</strong> has shipped and is on its way to you.</p>
            <div style="margin:32px 0;text-align:center;">
              <a href="${trackingId}" target="_blank" style="display:inline-block;background:#c00000;color:#f0f0f0;text-decoration:none;padding:14px 36px;font-family:monospace;font-size:12px;letter-spacing:.3em;text-transform:uppercase;">
                TRACK YOUR ORDER
              </a>
            </div>
            <p style="color:rgba(255,255,255,.4);font-size:11px;text-align:center;">Or copy this link: <a href="${trackingId}" style="color:#c00000;">${trackingId}</a></p>
            <hr style="border:none;border-top:1px solid rgba(192,0,0,.2);margin:24px 0;" />
            <p style="color:rgba(255,255,255,.25);font-size:11px;letter-spacing:.2em;">Ali Saffudin · IRTIQA · alisaffudin@gmail.com</p>
          </div>
        `,
      }).catch(console.error);
    }
  }

  return NextResponse.json({ ok: true });
}
