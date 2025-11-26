// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const TIMEOUT_MS = 3000;

export async function middleware(request: NextRequest) {
    const { url, nextUrl } = request;
    const pathname = nextUrl.pathname;

    const isSignInRoute = pathname === '/';
    const isRegisterAdminRoute = pathname === '/register';
    const isInvitationRoute = pathname === '/invitation';
    const isDashboardRoute = pathname.startsWith('/dashboard');

    const token = request.cookies.get('access_token')?.value;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/validate-request`,
            {
                method: 'GET',
                cache: 'no-store',
                headers: {
                    cookie: request.headers.get('cookie') ?? '',
                },
                signal: controller.signal,
            },
        );
        clearTimeout(timeout);

        if (response.status >= 500) {
            return NextResponse.rewrite(new URL('/service-unavailable', url));
        }

        const isOk = response.ok;

        if (isSignInRoute || isRegisterAdminRoute || isInvitationRoute) {
            if (isOk) {
                return NextResponse.redirect(new URL('/dashboard', url));
            }
        }

        if (isDashboardRoute) {
            if (!token || !isOk) {
                return NextResponse.redirect(new URL('/', url));
            }
        }
    } catch {
        clearTimeout(timeout);
        return NextResponse.rewrite(new URL('/service-unavailable', url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/register', '/invitation', '/dashboard/:path*'],
};
