import { NextRequest, NextResponse } from 'next/server';

const COOKIE = 'irtiqa_portal';

async function valid(token: string): Promise<boolean> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;
  try {
    const dot = token.indexOf('.');
    if (dot < 1) return false;
    const ts = token.slice(0, dot);
    const mac = token.slice(dot + 1);
    if (isNaN(parseInt(ts, 10)) || Date.now() > parseInt(ts, 10)) return false;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    );
    const b64 = mac.replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    const bytes = Uint8Array.from(atob(pad), c => c.charCodeAt(0));
    return crypto.subtle.verify('HMAC', key, bytes, enc.encode(`admin:${ts}`));
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === '/portal/login') return NextResponse.next();

  if (pathname.startsWith('/portal')) {
    const token = req.cookies.get(COOKIE)?.value;
    if (!token || !(await valid(token))) {
      const url = req.nextUrl.clone();
      url.pathname = '/portal/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ['/portal/:path*'] };
