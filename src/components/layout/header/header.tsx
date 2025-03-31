'use client';

import { usePathname } from 'next/navigation';

import HeaderActionBar from '@/components/layout/header/header-action-bar';
import HeaderBreadcrumbs from '@/components/layout/header/header-breadcrumbs';
import HeaderFilesSortingForm from '@/components/layout/header/header-files-sorting-form';
import { APP_ROUTES } from '@/libs/constants/routes';

const Header = () => {
    const pathname = usePathname();
    const isFilesPage = pathname.startsWith(APP_ROUTES.DASHBOARD.FILES.path);

    return (
        <>
            <header className="relative flex h-16 shrink-0 items-center gap-2 transition-[width] ease-linear">
                {isFilesPage && <HeaderActionBar />}
                <HeaderBreadcrumbs pathname={pathname} />
                {isFilesPage && <HeaderFilesSortingForm />}
            </header>
        </>
    );
};

export default Header;
