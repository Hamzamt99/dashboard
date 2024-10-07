import { NextResponse, NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = new URL(request.url);

  if (token && (pathname === '/auth/signin' || pathname === '/auth/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!token && pathname !== '/auth/signin' && pathname !== '/auth/signup') {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/protected-page', '/auth/signin', '/auth/signup'],
};
