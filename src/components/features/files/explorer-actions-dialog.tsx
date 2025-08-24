import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import MkdirForm from '@/components/features/files/forms/mkdir-form';
import { Button } from '@/components/ui/common/button';
import FilesExplorerModal from '@/components/ui/elements/files/files-explorer-modal';
import { useFilesQuery } from '@/libs/api/files/hooks/use-files-query';
import { filesPersistStore } from '@/libs/store/files/files.persist-store';

interface FolderPickerFormProps {
    mode: 'upload' | 'mkdir';
    isOpen: boolean;
    onClose: () => void;
    onAccept?: (dir: string) => void;
}

const ExplorerActionsDialog = ({
    mode,
    isOpen,
    onClose,
    onAccept,
}: FolderPickerFormProps) => {
    const t = useTranslations('files.explorer_dialog');
    const filesSortMode = filesPersistStore(state => state.filesSortMode);
    const filesSortDirection = filesPersistStore(
        state => state.filesSortDirection,
    );

    const [isMkdirFormOpen, setIsMkdirFormOpen] = useState(false);

    const [idContext, setIdContext] = useState('');

    const { data, isPending } = useFilesQuery({
        sortMode: filesSortMode,
        sortDirection: filesSortDirection,
        idContext: idContext,
    });

    const actionsMode = () => {
        if (mode === 'upload') {
            return (
                <>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setIsMkdirFormOpen(true);
                        }}
                    >
                        <Plus />
                        {t('actions.new_folder')}
                    </Button>
                    <Button
                        onClick={() => {
                            if (onAccept) {
                                onAccept(idContext);
                            }
                            onClose();
                        }}
                    >
                        {t('actions.upload')}
                    </Button>
                </>
            );
        } else {
            return (
                <Button
                    onClick={() => {
                        setIsMkdirFormOpen(true);
                    }}
                >
                    {t('actions.create')}
                </Button>
            );
        }
    };

    return (
        <>
            <FilesExplorerModal
                isOpen={isOpen}
                onClose={() => {
                    onClose();
                    setIdContext('');
                }}
                title={mode === 'upload' ? t('title.upload') : t('title.mkdir')}
                description={
                    mode === 'upload'
                        ? t('description.upload')
                        : t('description.mkdir')
                }
                isLoading={isPending}
                files={data}
                actionsRender={actionsMode()}
                idContext={idContext}
                setIdContext={idContext => setIdContext(idContext)}
            />

            <MkdirForm
                dir={idContext}
                isOpen={isMkdirFormOpen}
                onClose={() => {
                    setIsMkdirFormOpen(false);
                    if (mode === 'mkdir') {
                        onClose();
                    }
                }}
            />
        </>
    );
};

export default ExplorerActionsDialog;
