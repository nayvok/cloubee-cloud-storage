import { useState } from 'react';

import ActionBar from '@/components/features/controls/action-bar';
import EmptyTrashForm from '@/components/features/trash/forms/empty-trash-form';
import RestoreForm from '@/components/features/trash/forms/restore-form';
import useTrashActionItems from '@/components/features/trash/hooks/use-trash-action-items';
import { filesStore } from '@/libs/store/files/files.store';

const TrashActionBar = () => {
    const [isEmptyTrashFormOpen, setIsEmptyTrashFormOpen] = useState(false);
    const [isRestoreFormOpen, setIsRestoreFormOpen] = useState(false);

    const selectoRef = filesStore(state => state.selectoRef);
    const selectedFiles = filesStore(state => state.selectedFiles);
    const setSelectedFiles = filesStore(state => state.setSelectedFiles);
    const setLastSelectedFiles = filesStore(
        state => state.setLastSelectedFiles,
    );

    const actionBarItems = useTrashActionItems({
        restoreAction: () => {
            selectoRef.current?.setSelectedTargets([]);
            setLastSelectedFiles(selectedFiles);
            setSelectedFiles([]);
            setIsRestoreFormOpen(true);
        },
        permanentDeleteAction: () => {
            selectoRef.current?.setSelectedTargets([]);
            setLastSelectedFiles(selectedFiles);
            setSelectedFiles([]);
            setIsEmptyTrashFormOpen(true);
        },
    });

    return (
        <>
            <ActionBar actionItems={actionBarItems} />

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

export default TrashActionBar;
