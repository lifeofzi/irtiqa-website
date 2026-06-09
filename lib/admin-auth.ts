import { createHmac, timingSafeEqual } from 'crypto';
import { NextRequest } from 'next/server';

export const PORTAL_COOKIE = 'irtiqa_portal';

export function createSessionToken(): string {
  const secret = process.env.SESSION_SECRET!;
  const expiry = (Date.now() + 7 * 24 * 60 * 60 * 1000).toString();
  const mac = createHmac('sha256', secret).update(`admin:${expiry}`).digest('base64url');
  return `${expiry}.${mac}`;
}

export function validateSessionToken(token: string): boolean {
  try {
    const secret = process.env.SESSION_SECRET!;
    const dot = token.indexOf('.');
    if (dot < 1) return false;
    const ts = token.slice(0, dot);
    const mac = token.slice(dot + 1);
    if (isNaN(parseInt(ts, 10)) || Date.now() > parseInt(ts, 10)) return false;
    const expected = createHmac('sha256', secret).update(`admin:${ts}`).digest('base64url');
    if (mac.length !== expected.length) return false;
    return timingSafeEqual(Buffer.from(mac), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function isAdminRequest(req: NextRequest): boolean {
  const token = req.cookies.get(PORTAL_COOKIE)?.value;
  return token ? validateSessionToken(token) : false;
}
