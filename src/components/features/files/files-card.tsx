import { Download, PencilLine, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import MoveToTrashForm from '@/components/features/files/forms/move-to-trash-form';
import RenameForm from '@/components/features/files/forms/rename-form';
import FileCard, {
    ContextMenuItemType,
} from '@/components/ui/elements/files/file-card';
import { IFileResponse } from '@/libs/api/files/files.types';
import { useFileDownloader } from '@/libs/hooks/use-file-downloader';
import { filesStore } from '@/libs/store/files/files.store';
import { type TypeChangeFilesViewModeSchema } from '@/schemas/files/change-files-view-mode.schema';

interface FileCardProps {
    file: IFileResponse;
    viewMode: TypeChangeFilesViewModeSchema['mode'];
}

const FilesCard = ({ file, viewMode }: FileCardProps) => {
    const t = useTranslations('files.filesCard');
    const downloadFile = useFileDownloader();

    const [isRenameFormOpen, setIsRenameFormOpen] = useState(false);
    const [isMoveToTrashFormOpen, setIsMoveToTrashFormOpen] = useState(false);

    const selectedFiles = filesStore(state => state.selectedFiles);
    const setSelectedFiles = filesStore(state => state.setSelectedFiles);
    const setLastSelectedFiles = filesStore(
        state => state.setLastSelectedFiles,
    );
    const selectoRef = filesStore(state => state.selectoRef);

    const getMenuItems = (
        isMultiple: boolean,
        isHaveDir: boolean,
    ): ContextMenuItemType[] => {
        const baseItems: ContextMenuItemType[] = [
            {
                icon: Download,
                label: t('actions.download'),
                onClick: () => downloadFile(),
                show: !isHaveDir && !file.isDirectory,
            },
            {
                icon: PencilLine,
                label: t('actions.rename'),
                onClick: () => setIsRenameFormOpen(true),
                show: !isMultiple,
            },
            {
                icon: Trash2,
                label: t('actions.delete'),
                onClick: () => setIsMoveToTrashFormOpen(true),
                show: true,
            },
        ];

        return baseItems.filter(item => item.show);
    };

    return (
        <>
            <FileCard
                file={file}
                viewMode={viewMode}
                isFileSelected={Boolean(
                    selectedFiles?.find(f => f.id === file.id),
                )}
                contextMenuItems={getMenuItems(
                    selectedFiles.length > 1,
                    !selectedFiles.every(file => !file.isDirectory),
                )}
                onOpenChangeContextMenu={() => {
                    if (!selectedFiles.includes(file)) {
                        setSelectedFiles([]);
                        selectoRef.current?.setSelectedTargets([]);
                        setLastSelectedFiles([file]);
                    }
                }}
            />

            {isMoveToTrashFormOpen && (
                <MoveToTrashForm
                    isOpen={isMoveToTrashFormOpen}
                    onClose={() => setIsMoveToTrashFormOpen(false)}
                />
            )}

            {isRenameFormOpen && (
                <RenameForm
                    isOpen={isRenameFormOpen}
                    onClose={() => setIsRenameFormOpen(false)}
                />
            )}
        </>
    );
};

export default FilesCard;
