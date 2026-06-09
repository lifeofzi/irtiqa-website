import { NextResponse } from 'next/server';
import { PORTAL_COOKIE } from '@/lib/admin-auth';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(PORTAL_COOKIE);
  return res;
}
