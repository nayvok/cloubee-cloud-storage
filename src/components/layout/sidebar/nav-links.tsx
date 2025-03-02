import { Files, Images, type LucideIcon, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/common/sidebar';
import { APP_ROUTES } from '@/libs/constants/routes';

type navLinkType = {
    title: string;
    url: string;
    icon: LucideIcon;
};

export function NavLinks() {
    const pathname = usePathname();
    const t = useTranslations('layouts.sidebar.navLinks');

    const navLinks: navLinkType[] = [
        {
            title: t('files'),
            url: APP_ROUTES.DASHBOARD.FILES,
            icon: Files,
        },
        {
            title: t('gallery'),
            url: APP_ROUTES.DASHBOARD.GALLERY,
            icon: Images,
        },
        {
            title: t('trash'),
            url: APP_ROUTES.DASHBOARD.TRASH,
            icon: Trash2,
        },
    ];

    return (
        <SidebarGroup>
            <SidebarMenu>
                {navLinks.map(navLink => (
                    <SidebarMenuItem key={navLink.title}>
                        <SidebarMenuButton
                            asChild
                            className="text-sidebar-foreground/70"
                            tooltip={navLink.title}
                            isActive={pathname === navLink.url}
                        >
                            <Link href={navLink.url}>
                                <navLink.icon />
                                <span>{navLink.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
