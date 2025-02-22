import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    const { url, cookies, nextUrl } = request;

    const isSignInRoute = nextUrl.pathname === '/';
    const isRegisterAdminRoute = nextUrl.pathname === '/register';
    const isInvitationRoute = nextUrl.pathname === '/invitation';
    const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard');

    const token = cookies.get('access_token')?.value;

    if (isSignInRoute || isRegisterAdminRoute || isInvitationRoute) {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/validate-request`,
            {
                cache: 'no-store',
                headers: {
                    Cookie: `access_token=${token}`,
                },
            },
        );

        if (response.ok) {
            return NextResponse.redirect(new URL('/dashboard', url));
        }
    }

    if (isDashboardRoute) {
        if (!token) {
            return NextResponse.redirect(new URL('/', url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/register', '/invitation', '/dashboard/:path*'],
};
