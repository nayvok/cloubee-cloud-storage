import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/common/alert-dialog';
import { moveToTrashMutationFn } from '@/libs/api/files/files-api';
import { IFileResponse } from '@/libs/api/files/files.types';
import { QUERY_KEYS } from '@/libs/constants/query-keys';
import { filesPersistStore } from '@/libs/store/files/files.persist-store';
import { filesStore } from '@/libs/store/files/files.store';

interface MoveToTrashFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const MoveToTrashForm = ({ isOpen, onClose }: MoveToTrashFormProps) => {
    const t = useTranslations('files.moveToTrash');
    const queryClient = useQueryClient();
    const pathname = usePathname()
        .split('/')
        .filter(Boolean)
        .slice(2)
        .join('/');

    const lastSelectedFiles = filesStore(state => state.lastSelectedFiles);
    const filesSortMode = filesPersistStore(state => state.filesSortMode);
    const filesSortDirection = filesPersistStore(
        state => state.filesSortDirection,
    );

    const moveToTrashMutation = useMutation({
        mutationFn: moveToTrashMutationFn,

        onMutate: async ({ fileIds }) => {
            await queryClient.cancelQueries({
                queryKey: [
                    QUERY_KEYS.FILES,
                    filesSortMode,
                    filesSortDirection,
                    decodeURIComponent(pathname),
                ],
            });

            const previousFiles = queryClient.getQueryData([
                QUERY_KEYS.FILES,
                filesSortMode,
                filesSortDirection,
                decodeURIComponent(pathname),
            ]) as IFileResponse[];

            queryClient.setQueryData(
                [
                    QUERY_KEYS.FILES,
                    filesSortMode,
                    filesSortDirection,
                    decodeURIComponent(pathname),
                ],
                previousFiles.filter(
                    previousFile => !fileIds.includes(previousFile.id),
                ),
            );

            return { previousFiles };
        },

        async onSettled() {
            queryClient.invalidateQueries({
                predicate: query => query.queryKey[0] === QUERY_KEYS.FILES,
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.TRASH],
            });
        },
    });

    const moveToTrash = () => {
        onClose();
        const fileIds: string[] = lastSelectedFiles.map(file => file.id);
        toast.promise(moveToTrashMutation.mutateAsync({ fileIds }), {
            loading: t('toast.loading'),
            success: t('toast.success'),
            error: t('toast.error'),
            duration: 2000,
        });
    };

    const getAlertDialogTitle = () => {
        if (lastSelectedFiles.length > 1) {
            return t('dialog.title_multiple');
        }

        if (lastSelectedFiles[0]?.isDirectory) {
            return t('dialog.title_folder');
        }

        return t('dialog.title_file');
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="sm:max-w-[425px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>{getAlertDialogTitle()}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('dialog.description')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>
                        {t('dialog.cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={moveToTrash}>
                        {t('dialog.confirm')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default MoveToTrashForm;
