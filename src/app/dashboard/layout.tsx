import { cookies } from 'next/headers';
import { ReactNode } from 'react';

import Header from '@/components/layout/header/header';
import SidebarLayout from '@/components/layout/sidebar/sidebar-layout';
import { SidebarInset } from '@/components/ui/common/sidebar';
import FileUploaderList from '@/components/ui/elements/file-uploader-list';

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
                    <div className="bg-sidebar border-sidebar-border flex min-h-[100vh] flex-1 flex-col overflow-hidden rounded-lg border shadow-sm md:min-h-min">
                        {children}
                    </div>
                </div>
                <FileUploaderList />
            </SidebarInset>
        </SidebarLayout>
    );
}
