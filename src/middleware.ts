import { NextRequest, NextResponse } from 'next/server';

import { API_ROUTES } from '@/libs/constants/api';
import { APP_ROUTES } from '@/libs/constants/routes';

export async function middleware(request: NextRequest) {
    const { url, cookies, nextUrl } = request;

    const isSignInRoute = nextUrl.pathname === APP_ROUTES.LOGIN;
    const isRegisterAdminRoute = nextUrl.pathname === APP_ROUTES.REGISTER;
    const isInvitationRoute = nextUrl.pathname === APP_ROUTES.INVITATION;
    const isDashboardRoute = nextUrl.pathname.startsWith(
        APP_ROUTES.DASHBOARD.FILES,
    );

    const token = cookies.get('access_token')?.value;

    if (isSignInRoute || isRegisterAdminRoute || isInvitationRoute) {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ROUTES.AUTH.VALIDATE_REQUEST}`,
            {
                cache: 'no-store',
                headers: {
                    Cookie: `access_token=${token}`,
                },
            },
        );

        if (response.ok) {
            return NextResponse.redirect(
                new URL(APP_ROUTES.DASHBOARD.FILES, url),
            );
        }
    }

    if (isDashboardRoute) {
        if (!token) {
            return NextResponse.redirect(new URL(APP_ROUTES.LOGIN, url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        APP_ROUTES.LOGIN,
        APP_ROUTES.REGISTER,
        APP_ROUTES.INVITATION,
        `${APP_ROUTES.DASHBOARD.FILES}/:path*`,
    ],
};
