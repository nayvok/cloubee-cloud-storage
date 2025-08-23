'use client';

import { FilePlus, FolderPlus, Plus, Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { ChangeEvent, useState } from 'react';

import MkdirForm from '@/components/features/files/forms/mkdir-form';
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/common/sidebar';
import { useFileUploader } from '@/libs/hooks/use-file-uploader';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../ui/common/dropdown-menu';

export function NavButtons() {
    const t = useTranslations('layouts.sidebar.navButtons');
    const [isMkdirFormOpen, setIsMkdirFormOpen] = useState(false);
    const dir = usePathname().split('/').filter(Boolean).slice(2).join('/');

    const uploadFiles = useFileUploader();

    const onUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files) {
            const files = [...e.target.files];
            await uploadFiles({ dir, files });
        }
    };

    return (
        <SidebarGroup>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        tooltip={t('upload')}
                        className="bg-primary text-primary-foreground hover:bg-primary/75 hover:text-primary-foreground/100 active:bg-primary/75 active:text-primary-foreground/100 cursor-pointer"
                    >
                        <label className="relative flex cursor-pointer items-center gap-2">
                            <Upload className="h-4 w-4 cursor-pointer" />
                            <span className="cursor-pointer">
                                {t('upload')}
                            </span>
                            <input
                                type="file"
                                className="invisible absolute h-full w-full cursor-pointer"
                                multiple
                                onChange={onUpload}
                            />
                        </label>
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
                                <DropdownMenuItem
                                    onClick={() =>
                                        setIsMkdirFormOpen(!isMkdirFormOpen)
                                    }
                                >
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
                    <MkdirForm
                        isOpen={isMkdirFormOpen}
                        onClose={() => setIsMkdirFormOpen(false)}
                    />
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    );
}
