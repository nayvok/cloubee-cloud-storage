import { APP_ROUTES } from '@/libs/constants/routes';

type TranslateFunction = (key: string) => string;

export const generateBreadcrumbs = (pathname: string, t: TranslateFunction) => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    let currentPath = '';
    for (const segment of segments) {
        currentPath += `/${segment}`;
        const decodedSegment = decodeURIComponent(segment);

        if (currentPath === '/dashboard') {
            continue;
        }

        const route = Object.values(APP_ROUTES.DASHBOARD).find(
            r => r.path === currentPath,
        );

        if (route) {
            breadcrumbs.push({ path: route.path, title: t(route.title) });
        } else {
            breadcrumbs.push({ path: currentPath, title: decodedSegment });
        }
    }

    return breadcrumbs;
};
