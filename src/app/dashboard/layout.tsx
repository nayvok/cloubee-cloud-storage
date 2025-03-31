import { ReactNode } from 'react';

import Header from '@/components/layout/header/header';
import SidebarLayout from '@/components/layout/sidebar/sidebar-layout';
import { SidebarInset } from '@/components/ui/common/sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarLayout>
            <SidebarInset>
                <Header />
                <div className="flex flex-1 flex-col gap-4 p-2 pt-0">
                    <div className="bg-sidebar border-sidebar-border flex min-h-[100vh] flex-1 flex-col overflow-hidden rounded-xl border shadow-sm md:min-h-min">
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarLayout>
    );
}
