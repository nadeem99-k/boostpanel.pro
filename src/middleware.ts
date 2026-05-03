import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require being logged in
const PROTECTED_ROUTES = ['/dashboard', '/admin'];
// Routes that logged-in users should not visit
const AUTH_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check session cookie (set on login)
  const session = request.cookies.get('smm_session')?.value;

  const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some(r => pathname.startsWith(r));

  // Not logged in → trying to access protected page → redirect to login
  if (isProtected && !session) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Already logged in → trying to access login/register → redirect to dashboard
  if (isAuthRoute && session) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
