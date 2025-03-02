'use client';

import { PropsWithChildren } from 'react';

import { AppSidebar } from '@/components/layout/sidebar/app-sidebar';
import { SidebarProvider } from '@/components/ui/common/sidebar';

type SidebarLayoutProps = PropsWithChildren;

const SidebarLayout = ({ children }: SidebarLayoutProps) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            {children}
        </SidebarProvider>
    );
};

export default SidebarLayout;
