import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/signin') && !request.cookies.has('user')) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  if (request.nextUrl.pathname.startsWith('/signin') && request.cookies.has('user')) {
    return NextResponse.redirect(new URL('/home', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/images|logo*|favicon.ico).*)']
};
