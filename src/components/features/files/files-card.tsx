import { useState } from 'react';

import MoveToTrashForm from '@/components/features/files/forms/move-to-trash-form';
import RenameForm from '@/components/features/files/forms/rename-form';
import useFilesActionItems from '@/components/features/files/hooks/use-files-action-items';
import useMobileSelection from '@/components/features/trash/hooks/use-mobile-selection';
import FileCard from '@/components/ui/elements/files/file-card';
import { IFileResponse } from '@/libs/api/files/files.types';
import { useFileDownloader } from '@/libs/hooks/use-file-downloader';
import { filesStore } from '@/libs/store/files/files.store';
import { type TypeChangeFilesViewModeSchema } from '@/schemas/files/change-files-view-mode.schema';

interface FileCardProps {
    file: IFileResponse;
    files: IFileResponse[];
    pathname: string;
    viewMode: TypeChangeFilesViewModeSchema['mode'];
}

const FilesCard = ({ file, files, pathname, viewMode }: FileCardProps) => {
    const downloadFile = useFileDownloader();

    const [isRenameFormOpen, setIsRenameFormOpen] = useState(false);
    const [isMoveToTrashFormOpen, setIsMoveToTrashFormOpen] = useState(false);

    const selectedFiles = filesStore(state => state.selectedFiles);
    const setSelectedFiles = filesStore(state => state.setSelectedFiles);
    const setLastSelectedFiles = filesStore(
        state => state.setLastSelectedFiles,
    );

    const selectoRef = filesStore(state => state.selectoRef);

    const contextMenuItems = useFilesActionItems({
        downloadAction: () => downloadFile(),
        renameAction: () => setIsRenameFormOpen(true),
        deleteAction: () => setIsMoveToTrashFormOpen(true),
        isMultiple: selectedFiles.length > 1,
        isHaveDir:
            !selectedFiles.every(file => !file.isDirectory) || file.isDirectory,
    });

    const { handleClick, handleTouchStart, handleTouchEnd } =
        useMobileSelection({
            file: file,
            files: files,
            pathname: pathname,
        });

    return (
        <>
            <FileCard
                file={file}
                viewMode={viewMode}
                isFileSelected={Boolean(
                    selectedFiles?.find(f => f.id === file.id),
                )}
                contextMenuItems={contextMenuItems}
                onOpenChangeContextMenu={() => {
                    if (!selectedFiles.includes(file)) {
                        setSelectedFiles([]);
                        selectoRef.current?.setSelectedTargets([]);
                        setLastSelectedFiles([file]);
                    }
                }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onClick={handleClick}
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
