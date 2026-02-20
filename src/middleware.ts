import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the absolute path to ensure we write to the project root.
export function middleware(request: NextRequest) {
    // 1. Get the auth cookie from the request
    const authCookie = request.cookies.get('auth');
    const isAuthenticated = authCookie?.value === 'true';

    // 2. Determine paths
    const isLoginPage = request.nextUrl.pathname.startsWith('/login');
    const isAuthApi = request.nextUrl.pathname.startsWith('/api/auth');

    // Allow requests to the login page itself or the auth API
    if (isLoginPage || isAuthApi) {
        // If they try to go to login but are already authenticated, redirect to home
        if (isAuthenticated && isLoginPage) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    // 3. Any other route requires authentication
    if (!isAuthenticated) {
        // Redirect to login page
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Return next if authenticated
    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
