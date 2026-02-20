import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        // Check against environment variable
        if (password === process.env.APP_PASSWORD) {
            // Success - Set HTTP Only cookie
            const response = NextResponse.json({ success: true });

            // Set cookie that expires in 30 days
            response.cookies.set({
                name: 'auth',
                value: 'true',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',
            });

            return response;
        }

        // Failure
        return NextResponse.json(
            { success: false, error: 'Incorrect password' },
            { status: 401 }
        );

    } catch (error) {
        console.error("Auth API Error:", error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
