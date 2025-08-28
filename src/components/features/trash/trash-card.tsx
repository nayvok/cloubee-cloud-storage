import { useState } from 'react';

import EmptyTrashForm from '@/components/features/trash/forms/empty-trash-form';
import RestoreForm from '@/components/features/trash/forms/restore-form';
import useMobileSelection from '@/components/features/trash/hooks/use-mobile-selection';
import useTrashActionItems from '@/components/features/trash/hooks/use-trash-action-items';
import FileCard from '@/components/ui/elements/files/file-card';
import { IFileResponse } from '@/libs/api/files/files.types';
import { filesStore } from '@/libs/store/files/files.store';
import { type TypeChangeFilesViewModeSchema } from '@/schemas/files/change-files-view-mode.schema';

interface TrashCardProps {
    file: IFileResponse;
    files: IFileResponse[];
    viewMode: TypeChangeFilesViewModeSchema['mode'];
}

const TrashCard = ({ file, files, viewMode }: TrashCardProps) => {
    const [isEmptyTrashFormOpen, setIsEmptyTrashFormOpen] = useState(false);
    const [isRestoreFormOpen, setIsRestoreFormOpen] = useState(false);

    const selectedFiles = filesStore(state => state.selectedFiles);
    const setSelectedFiles = filesStore(state => state.setSelectedFiles);
    const setLastSelectedFiles = filesStore(
        state => state.setLastSelectedFiles,
    );
    const selectoRef = filesStore(state => state.selectoRef);

    const contextMenuItems = useTrashActionItems({
        restoreAction: () => setIsRestoreFormOpen(true),
        permanentDeleteAction: () => setIsEmptyTrashFormOpen(true),
    });

    const { handleClick, handleTouchStart, handleTouchEnd } =
        useMobileSelection({
            file: file,
            files: files,
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

            {isEmptyTrashFormOpen && (
                <EmptyTrashForm
                    isOpen={isEmptyTrashFormOpen}
                    onClose={() => setIsEmptyTrashFormOpen(false)}
                    deleteAll={false}
                />
            )}

            {isRestoreFormOpen && (
                <RestoreForm
                    isOpen={isRestoreFormOpen}
                    onClose={() => setIsRestoreFormOpen(false)}
                />
            )}
        </>
    );
};

export default TrashCard;
