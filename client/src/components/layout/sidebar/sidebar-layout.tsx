'use client';

import { PropsWithChildren, useState } from 'react';

import { AppSidebar } from '@/components/layout/sidebar/app-sidebar';
import {
    SIDEBAR_COOKIE_NAME,
    SidebarProvider,
} from '@/components/ui/common/sidebar';

type SidebarLayoutProps = PropsWithChildren & {
    initialOpen?: boolean;
};

const SidebarLayout = ({ children, initialOpen }: SidebarLayoutProps) => {
    const [isOpen, setIsOpen] = useState(initialOpen ?? true);

    return (
        <SidebarProvider
            open={isOpen}
            defaultOpen={isOpen}
            onOpenChange={open => {
                setIsOpen(open);
                document.cookie = `${SIDEBAR_COOKIE_NAME}=${open}`;
            }}
        >
            <AppSidebar />
            {children}
        </SidebarProvider>
    );
};

export default SidebarLayout;
