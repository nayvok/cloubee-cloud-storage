'use client';

import { usePathname } from 'next/navigation';

import FilesActionBar from '@/components/features/files/files-action-bar';
import FilesHeaderPanel from '@/components/features/files/files-header-panel';
import TrashActionBar from '@/components/features/trash/trash-action-bar';
import TrashHeaderPanel from '@/components/features/trash/trash-header-panel';
import HeaderBreadcrumbs from '@/components/layout/header/header-breadcrumbs';
import { APP_ROUTES } from '@/libs/constants/routes';

const Header = () => {
    const pathname = usePathname();
    const isFilesPage = pathname.startsWith(APP_ROUTES.DASHBOARD.FILES.path);
    const isTrashPage = pathname.startsWith(APP_ROUTES.DASHBOARD.TRASH.path);

    return (
        <header className="relative flex h-16 shrink-0 items-center gap-2 transition-[width] ease-linear">
            {isFilesPage && <FilesActionBar />}
            {isTrashPage && <TrashActionBar />}
            <HeaderBreadcrumbs pathname={pathname} />
            {isFilesPage && <FilesHeaderPanel />}
            {isTrashPage && <TrashHeaderPanel />}
        </header>
    );
};

export default Header;
