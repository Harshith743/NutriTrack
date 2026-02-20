import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        // Check if the provided password matches the environment variable
        if (password === process.env.APP_PASSWORD) {

            // Create a response
            const response = NextResponse.json({ success: true }, { status: 200 });

            // Set an HttpOnly cookie that the middleware will look for
            // MaxAge is set to 30 days (in seconds)
            response.cookies.set({
                name: 'nutri_auth',
                value: 'authenticated',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',
            });

            return response;
        } else {
            return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
        }
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: 'Failed to process login' }, { status: 500 });
    }
}
