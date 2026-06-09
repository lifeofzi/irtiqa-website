import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { createSessionToken, PORTAL_COOKIE } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const emailOk = email === adminEmail;
  let passwordOk = false;
  try {
    const a = Buffer.from(String(password ?? ''));
    const b = Buffer.from(adminPassword);
    // Pad to same length before comparing to avoid length-leak
    const maxLen = Math.max(a.length, b.length);
    const pa = Buffer.concat([a, Buffer.alloc(maxLen - a.length)]);
    const pb = Buffer.concat([b, Buffer.alloc(maxLen - b.length)]);
    passwordOk = timingSafeEqual(pa, pb) && a.length === b.length;
  } catch {
    passwordOk = false;
  }

  if (!emailOk || !passwordOk) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(PORTAL_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}
