import { useTranslations } from 'next-intl';
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
import { usePermanentDeleteMutation } from '@/libs/api/files/hooks/use-permanent-delete-mutation';
import { filesStore } from '@/libs/store/files/files.store';

interface EmptyTrashFormProps {
    isOpen: boolean;
    onClose: () => void;
    deleteAll: boolean;
}

const EmptyTrashForm = ({
    isOpen,
    onClose,
    deleteAll,
}: EmptyTrashFormProps) => {
    const t = useTranslations('trash.emptyTrash');

    const lastSelectedFiles = filesStore(state => state.lastSelectedFiles);

    const { mutateAsync } = usePermanentDeleteMutation();

    const onClickDelete = () => {
        onClose();
        if (deleteAll) {
            toast.promise(mutateAsync({ fileIds: [], deleteAll: true }), {
                loading: t('allTrash.toast.loading'),
                success: t('allTrash.toast.success'),
                error: t('allTrash.toast.error'),
                duration: 2000,
            });
        } else {
            toast.promise(
                mutateAsync({
                    fileIds: lastSelectedFiles.map(file => file.id),
                    deleteAll: false,
                }),
                {
                    loading: t('toast.loading'),
                    success: t('toast.success'),
                    error: t('toast.error'),
                    duration: 2000,
                },
            );
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {deleteAll ? t('allTrash.title') : t('title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {deleteAll
                            ? t.rich('allTrash.description', {
                                  br: () => <br />,
                              })
                            : t.rich('description', {
                                  br: () => <br />,
                              })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        {deleteAll ? t('allTrash.cancel') : t('cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onClickDelete}>
                        {deleteAll ? t('allTrash.confirm') : t('confirm')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default EmptyTrashForm;
