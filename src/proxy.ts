import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    // Define paths that don't require authentication
    const isPublicPath = request.nextUrl.pathname === '/login' ||
        request.nextUrl.pathname.startsWith('/api/login');

    // Next.js static files and images should bypass middleware
    if (
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.startsWith('/favicon.ico') ||
        request.nextUrl.pathname.startsWith('/public')
    ) {
        return NextResponse.next();
    }

    // Get the auth cookie
    const authCookie = request.cookies.get('nutri_auth')?.value;

    // If trying to access a protected route without a valid cookie, redirect to login
    if (!isPublicPath && authCookie !== 'authenticated') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If trying to access login page while already authenticated, redirect to dashboard
    if (isPublicPath && request.nextUrl.pathname === '/login' && authCookie === 'authenticated') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes) -> We want to protect API routes as well!
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
