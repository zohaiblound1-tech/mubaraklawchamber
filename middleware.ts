import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_PATH } from './lib/config';
import { SESSION_COOKIE, isValidSession } from './lib/session';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authed = await isValidSession(req.cookies.get(SESSION_COOKIE)?.value);
  const isApi = pathname.startsWith('/api/admin');
  const isLogin = pathname === `${ADMIN_PATH}/login`;

  let res: NextResponse;
  if (!authed && isApi) res = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  else if (!authed && !isLogin) res = NextResponse.redirect(new URL(`${ADMIN_PATH}/login`, req.url));
  else if (authed && isLogin) res = NextResponse.redirect(new URL(ADMIN_PATH, req.url));
  else res = NextResponse.next();

  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

// Must be static literals; keep in sync with ADMIN_PATH in lib/config.ts.
export const config = {
  matcher: ['/secure-admin-portal-xyz789/:path*', '/api/admin/:path*'],
};
