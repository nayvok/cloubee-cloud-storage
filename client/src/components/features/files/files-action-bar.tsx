import { useState } from 'react';

import ActionBar from '@/components/features/controls/action-bar';
import MoveToTrashForm from '@/components/features/files/forms/move-to-trash-form';
import RenameForm from '@/components/features/files/forms/rename-form';
import useFilesActionItems from '@/components/features/files/hooks/use-files-action-items';
import { useFileDownloader } from '@/libs/hooks/use-file-downloader';
import { filesStore } from '@/libs/store/files/files.store';

const FilesActionBar = () => {
    const downloadFile = useFileDownloader();

    const selectoRef = filesStore(state => state.selectoRef);
    const selectedFiles = filesStore(state => state.selectedFiles);
    const setSelectedFiles = filesStore(state => state.setSelectedFiles);
    const setLastSelectedFiles = filesStore(
        state => state.setLastSelectedFiles,
    );

    const [isRenameFormOpen, setIsRenameFormOpen] = useState(false);
    const [isMoveToTrashFormOpen, setIsMoveToTrashFormOpen] = useState(false);

    const actionBarItems = useFilesActionItems({
        downloadAction: () => downloadFile(),
        renameAction: () => {
            selectoRef.current?.setSelectedTargets([]);
            setLastSelectedFiles(selectedFiles);
            setSelectedFiles([]);
            setIsRenameFormOpen(true);
        },
        deleteAction: () => {
            selectoRef.current?.setSelectedTargets([]);
            setLastSelectedFiles(selectedFiles);
            setSelectedFiles([]);
            setIsMoveToTrashFormOpen(!isMoveToTrashFormOpen);
        },
        isMultiple: selectedFiles.length > 1,
        isHaveDir: !selectedFiles.every(file => !file.isDirectory),
    });

    return (
        <>
            <ActionBar actionItems={actionBarItems} />

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

export default FilesActionBar;
