import { cookies } from 'next/headers';
import { ReactNode } from 'react';

import FileUploaderList from '@/components/features/files/file-uploader-list';
import Header from '@/components/layout/header/header';
import SidebarLayout from '@/components/layout/sidebar/sidebar-layout';
import { SidebarInset } from '@/components/ui/common/sidebar';
import { cn } from '@/libs/utils/tw-merge';

export default async function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    const cookieStore = await cookies();
    const sidebarCookie = cookieStore.get('sidebar_state')?.value;

    const initialOpen = sidebarCookie ? sidebarCookie === 'true' : true;

    return (
        <SidebarLayout initialOpen={initialOpen}>
            <SidebarInset>
                <Header />
                <div className="flex flex-1 flex-col gap-4 p-2 pt-0">
                    <div
                        className={cn(
                            'bg-sidebar border-sidebar-border flex flex-col overflow-hidden rounded-lg border shadow-sm',
                            'h-0 flex-1 md:min-h-min',
                        )}
                    >
                        {children}
                    </div>
                </div>
                <FileUploaderList />
            </SidebarInset>
        </SidebarLayout>
    );
}
