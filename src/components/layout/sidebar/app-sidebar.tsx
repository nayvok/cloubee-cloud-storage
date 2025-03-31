import { type ComponentProps } from 'react';

import DiskUsageSidebar from '@/components/layout/sidebar/disk-usage-sidebar';
import { LogoSidebar } from '@/components/layout/sidebar/logo-sidebar';
import { NavButtons } from '@/components/layout/sidebar/nav-buttons';
import { NavLinks } from '@/components/layout/sidebar/nav-links';
import { NavUser } from '@/components/layout/sidebar/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from '@/components/ui/common/sidebar';
import { useUserQuery } from '@/libs/api/users/hooks/use-user-query';

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
    const { data, isPending } = useUserQuery();

    return (
        <Sidebar collapsible="icon" {...props} variant="floating">
            <SidebarHeader>
                <LogoSidebar />
            </SidebarHeader>
            <SidebarContent>
                <NavButtons />
                <NavLinks />
            </SidebarContent>
            <SidebarContent className="justify-end">
                <DiskUsageSidebar
                    isLoading={isPending}
                    usedQuota={Number(data?.usedQuota) ?? 0}
                    storageQuota={Number(data?.storageQuota) ?? 0}
                />
            </SidebarContent>
            <SidebarFooter>
                <NavUser
                    name={data?.name ?? ''}
                    email={data?.email ?? ''}
                    avatar={data?.avatarPath || '/avatar.png'}
                    isLoading={isPending}
                />
            </SidebarFooter>
        </Sidebar>
    );
}
