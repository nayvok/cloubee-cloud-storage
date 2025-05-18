import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/common/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/common/dialog';
import { moveToTrashMutationFn } from '@/libs/api/files/files-api';
import { IFileResponse } from '@/libs/api/files/files.types';
import { QUERY_KEYS } from '@/libs/api/query-keys';
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {lastSelectedFiles.length > 1
                            ? t('dialog.title_multiple')
                            : lastSelectedFiles[0]?.isDirectory
                              ? t('dialog.title_folder')
                              : t('dialog.title_file')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('dialog.description')}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="secondary" onClick={onClose}>
                        {t('dialog.cancel')}
                    </Button>
                    <Button onClick={moveToTrash}>{t('dialog.confirm')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default MoveToTrashForm;
