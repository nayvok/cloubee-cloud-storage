import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
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
import { QUERY_KEYS } from '@/libs/api/query-keys';
import { deleteUserMutationFn } from '@/libs/api/users/users-api';
import { IUserResponse } from '@/libs/api/users/users.types';

interface DeleteUserAlertProps {
    isOpen: boolean;
    onClose: () => void;
    userData: IUserResponse | null;
}

const DeleteUserAlert = ({
    isOpen,
    onClose,
    userData,
}: DeleteUserAlertProps) => {
    const t = useTranslations('settings.users.dialogs.delete');
    const queryClient = useQueryClient();

    const deleteUserMutation = useMutation({
        mutationFn: deleteUserMutationFn,

        onError(error: Error) {
            onClose();
            if (error.message === 'NOT_FOUND') {
                toast.error(t('not_found'));
            }
        },

        async onSuccess() {
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.USERS],
            });
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.USER],
            });
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.FREE_SPACE],
            });
            onClose();
        },
    });

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('description', {
                            email: userData?.email,
                        })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={onClose}
                        disabled={deleteUserMutation.isPending}
                    >
                        {t('cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={deleteUserMutation.isPending}
                        onClick={() => deleteUserMutation.mutate(userData!.id)}
                    >
                        {deleteUserMutation.isPending && (
                            <Loader2 className="animate-spin" />
                        )}
                        {t('action')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteUserAlert;
