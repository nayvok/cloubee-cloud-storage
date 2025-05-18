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
import { useRestoreMutation } from '@/libs/api/files/hooks/use-restore-mutation';
import { filesStore } from '@/libs/store/files/files.store';

interface RestoreFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const RestoreForm = ({ isOpen, onClose }: RestoreFormProps) => {
    const t = useTranslations('trash.restore');

    const lastSelectedFiles = filesStore(state => state.lastSelectedFiles);

    const { mutateAsync } = useRestoreMutation();

    const onClickDelete = async () => {
        onClose();
        const toastId = toast.loading(
            lastSelectedFiles.length > 1
                ? t('toast.loading.many')
                : t('toast.loading.single'),
        );

        try {
            const data = await mutateAsync({
                fileIds: lastSelectedFiles.map(file => file.id),
            });

            if (lastSelectedFiles.length > 1) {
                if (data.restored.length >= 1 && data.errors.length === 0) {
                    toast.success(
                        t('toast.success.many', {
                            count: data.restored.length,
                        }),
                        {
                            id: toastId,
                        },
                    );
                } else if (
                    data.restored.length >= 1 &&
                    data.errors.length >= 1
                ) {
                    toast.info(
                        t('toast.success.many', {
                            count: data.restored.length,
                        }),
                        {
                            id: toastId,
                            description: (
                                <div className="flex flex-col">
                                    <span>
                                        {t('toast.errors.many.text', {
                                            count: 2,
                                        })}
                                    </span>
                                    <span>{t('toast.errors.many.type')}</span>
                                </div>
                            ),
                        },
                    );
                } else {
                    toast.error(
                        t('toast.errors.many.text', {
                            count: data.errors.length,
                        }),
                        {
                            id: toastId,
                            description: t('toast.errors.many.type'),
                        },
                    );
                }
            } else {
                if (data.restored.length === 1) {
                    toast.success(
                        t('toast.success.single', {
                            fileName: data.restored[0].name,
                        }),
                        {
                            id: toastId,
                        },
                    );
                } else {
                    toast.error(t('toast.errors.single.text'), {
                        id: toastId,
                        description: t('toast.errors.single.type'),
                    });
                }
            }
        } catch {
            toast.error(t('toast.errors.default'), { id: toastId });
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {lastSelectedFiles.length > 1
                            ? t('many.title')
                            : t('single.title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="sr-only" />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={onClickDelete}>
                        {t('confirm')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default RestoreForm;
