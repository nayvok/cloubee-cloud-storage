'use client';

import { FilePlus, FolderPlus, Plus, Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { ChangeEvent, useRef, useState } from 'react';

import ExplorerActionsDialog from '@/components/features/files/explorer-actions-dialog';
import MkdirForm from '@/components/features/files/forms/mkdir-form';
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/common/sidebar';
import { APP_ROUTES } from '@/libs/constants/routes';
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
    const pathname = usePathname();

    const uploadFiles = useFileUploader();

    const [isUploadExplorerOpen, setIsUploadExplorerOpen] = useState(false);
    const [isMkdirExplorerOpen, setIsMkdirExplorerOpen] = useState(false);

    const [fileList, setFileList] = useState<FileList | null>(null);

    const inputValueRef = useRef<ChangeEvent<HTMLInputElement>>(null);

    const dir = pathname.split('/').filter(Boolean).slice(2).join('/');

    const clearInputValue = () => {
        if (inputValueRef.current) {
            inputValueRef.current.target.value = '';
        }
    };

    const onUpload = async (dir: string, fileList: FileList | null) => {
        if (fileList) {
            const files = [...fileList];
            await uploadFiles({ dir, files });
            clearInputValue();
        }
    };

    const onChangeUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        inputValueRef.current = e;

        if (!pathname.startsWith(APP_ROUTES.DASHBOARD.FILES.path)) {
            setFileList(e.target.files);
            setIsUploadExplorerOpen(true);
        } else {
            await onUpload(dir, e.target.files);
        }
    };

    const onClickMkdir = () => {
        if (!pathname.startsWith(APP_ROUTES.DASHBOARD.FILES.path)) {
            setIsMkdirExplorerOpen(true);
        } else {
            setIsMkdirFormOpen(!isMkdirFormOpen);
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
                                onChange={onChangeUpload}
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
                                <DropdownMenuItem onClick={onClickMkdir}>
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
                        dir={dir}
                        isOpen={isMkdirFormOpen}
                        onClose={() => setIsMkdirFormOpen(false)}
                    />
                </SidebarMenuItem>
            </SidebarMenu>

            <ExplorerActionsDialog
                mode="upload"
                isOpen={isUploadExplorerOpen}
                onClose={() => {
                    clearInputValue();
                    setIsUploadExplorerOpen(false);
                }}
                onAccept={async dir => await onUpload(dir, fileList)}
            />

            <ExplorerActionsDialog
                mode="mkdir"
                isOpen={isMkdirExplorerOpen}
                onClose={() => {
                    setIsMkdirExplorerOpen(false);
                }}
            />
        </SidebarGroup>
    );
}
