import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
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
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/common/form';
import { Input } from '@/components/ui/common/input';
import { useFreeSpaceQuery } from '@/libs/api/files/hooks/use-free-space-query';
import { QUERY_KEYS } from '@/libs/api/query-keys';
import { changeUserByAdminMutationFn } from '@/libs/api/users/users-api';
import { IUserResponse } from '@/libs/api/users/users.types';
import { convertBytes } from '@/libs/utils/convert-bytes';
import { convertGbToBytes } from '@/libs/utils/convert-gb-to-bytes';
import {
    TypeChangeUserByAdminSchema,
    changeUserByAdminSchema,
} from '@/schemas/users/change-user-by-admin.schema';

interface EditUserByAdminFormProps {
    isOpen: boolean;
    onClose: () => void;
    userData: IUserResponse | null;
}

const EditUserByAdminForm = ({
    isOpen,
    onClose,
    userData,
}: EditUserByAdminFormProps) => {
    const t = useTranslations('settings.users.dialogs.edit');
    const { data: freeSpace } = useFreeSpaceQuery();
    const queryClient = useQueryClient();

    const minQuota =
        Math.ceil(Number(userData?.usedQuota) / (1024 * 1024 * 1024)) >= 1
            ? Math.ceil(Number(userData?.usedQuota) / (1024 * 1024 * 1024))
            : 1;

    const maxQuota =
        Math.floor(Number(freeSpace) / (1024 * 1024 * 1024)) +
        Math.floor(Number(userData?.storageQuota) / (1024 * 1024 * 1024));

    const form = useForm<TypeChangeUserByAdminSchema>({
        resolver: zodResolver(changeUserByAdminSchema),
        defaultValues: {
            id: userData?.id,
            storageQuota: 0,
        },
    });

    const changeUserByAdminMutation = useMutation({
        mutationFn: changeUserByAdminMutationFn,

        onError(error: Error) {
            if (error.message === 'QUOTA_CONFLICT') {
                form.setError('storageQuota', {
                    type: 'manual',
                    message: t('errors.quota_conflict'),
                });
            } else {
                onClose();
                toast.error(t('errors.unexpected_error'));
            }
        },

        async onSuccess() {
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.USER],
            });
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.USERS],
            });
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.FREE_SPACE],
            });
            onClose();
            form.reset();
            toast.success(t('edit_success'));
        },
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                aria-describedby={undefined}
                className="sm:max-w-[425px]"
            >
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription>
                        {t('description.quota_info', {
                            email: userData?.email,
                            used: convertBytes(Number(userData?.usedQuota)),
                            quota: convertBytes(Number(userData?.storageQuota)),
                        })}
                        <br />
                        {t('description.quota_action')}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(data => {
                            const { storageQuota } = data;
                            const bytes = convertGbToBytes(storageQuota);
                            changeUserByAdminMutation.mutate({
                                id: userData!.id,
                                storageQuota: bytes,
                            });
                        })}
                        className="grid w-full gap-4"
                    >
                        <FormField
                            control={form.control}
                            name="storageQuota"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t('form.quota_label')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={minQuota}
                                            max={maxQuota}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {t('form.quota_description', {
                                            minQuota: minQuota,
                                            maxQuota: maxQuota,
                                        })}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                isLoading={changeUserByAdminMutation.isPending}
                            >
                                {t('submit')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditUserByAdminForm;
