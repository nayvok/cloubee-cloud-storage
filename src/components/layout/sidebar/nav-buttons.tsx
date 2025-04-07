'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FilePlus, FolderPlus, Plus, Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { toast } from 'sonner';

import MkdirForm from '@/components/features/files/forms/mkdir-form';
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/common/sidebar';
import { uploadMutationFn } from '@/libs/api/files/files-api';
import { QUERY_KEYS } from '@/libs/api/query-keys';

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

    const queryClient = useQueryClient();
    const pathname = usePathname()
        .split('/')
        .filter(Boolean)
        .slice(2)
        .join('/');

    const uploadMutation = useMutation({
        mutationFn: uploadMutationFn,

        async onSettled() {
            queryClient.invalidateQueries({
                predicate: query => query.queryKey[0] === QUERY_KEYS.FILES,
            });
        },
    });

    const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            for (const file of e.target.files) {
                toast.promise(
                    uploadMutation.mutateAsync({
                        file: file,
                        idContext: pathname,
                    }),
                    {
                        loading: 'Загрузка',
                        success: 'Успешно',
                        error: 'Ошибка',
                    },
                );
            }
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
                        <label className="flex cursor-pointer items-center gap-2">
                            <Upload className="h-4 w-4 cursor-pointer" />
                            <span className="cursor-pointer">
                                {t('upload')}
                            </span>
                            <input
                                type="file"
                                className="absolute h-full w-full cursor-pointer opacity-0"
                                multiple
                                onChange={onChange}
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
