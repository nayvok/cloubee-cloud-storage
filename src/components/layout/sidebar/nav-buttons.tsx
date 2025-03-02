'use client';

import { FilePlus, FolderPlus, Plus, Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/common/sidebar';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../ui/common/dropdown-menu';

export function NavButtons() {
    const t = useTranslations('layouts.sidebar.navButtons');

    return (
        <SidebarGroup>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        tooltip={t('upload')}
                        className="bg-primary text-primary-foreground hover:bg-primary/75 hover:text-primary-foreground/100 active:bg-primary/75 active:text-primary-foreground/100"
                    >
                        <Upload />
                        <span>{t('upload')}</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                tooltip={t('create.title')}
                                variant="outline"
                            >
                                <Plus />
                                <span>{t('create.title')}</span>
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                            side="bottom"
                            align="start"
                            sideOffset={4}
                        >
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <FolderPlus />
                                    {t('create.folder')}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <FilePlus />
                                    {t('create.text')}
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    );
}
