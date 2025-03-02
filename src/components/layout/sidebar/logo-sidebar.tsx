import { Cloud } from 'lucide-react';
import Link from 'next/link';

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/common/sidebar';

export function LogoSidebar() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <Link
                    href="https://github.com/cloubee-cloud-storage"
                    target="_blank"
                >
                    <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                        <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                            <Cloud className="size-4" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">
                                Cloubee
                            </span>
                            <span className="text-muted-foreground truncate text-xs">
                                v0.0.1
                            </span>
                        </div>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
