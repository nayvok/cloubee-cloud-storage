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
import { addInvitationMutationFn } from '@/libs/api/invitations/invitations-api';
import { QUERY_KEYS } from '@/libs/api/query-keys';
import { convertGbToBytes } from '@/libs/utils/convert-gb-to-bytes';
import {
    TypeAddInvitationSchema,
    useAddInvitationSchema,
} from '@/schemas/invitations/add-invitation.schema';

interface AddInvitationFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddInvitationForm = ({ isOpen, onClose }: AddInvitationFormProps) => {
    const t = useTranslations('settings.invitations.dialogs.add');
    const queryClient = useQueryClient();

    const addInvitationSchema = useAddInvitationSchema();

    const { data: freeSpace } = useFreeSpaceQuery();

    const maxQuota = Math.floor(Number(freeSpace) / (1024 * 1024 * 1024));

    const form = useForm<TypeAddInvitationSchema>({
        resolver: zodResolver(addInvitationSchema),
        defaultValues: {
            email: '',
            storageQuota: 0,
        },
    });

    const addInvitationMutation = useMutation({
        mutationFn: addInvitationMutationFn,

        onError(error: Error) {
            if (error.message === 'EMAIL_ALREADY_EXISTS') {
                form.setError('email', {
                    type: 'manual',
                    message: t('errors.email_already_exist'),
                });
            } else {
                onClose();
                toast.error(t('errors.unexpected_error'));
            }
        },

        async onSuccess() {
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.INVITATIONS],
            });
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.USER],
            });
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.FREE_SPACE],
            });
            onClose();
            form.reset();
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
                        {maxQuota > 0
                            ? t('description.invite')
                            : t('description.storage_warning')}
                    </DialogDescription>
                </DialogHeader>

                {maxQuota > 0 && (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(data => {
                                const { email, storageQuota } = data;
                                const bytes = convertGbToBytes(storageQuota);
                                addInvitationMutation.mutate({
                                    email,
                                    storageQuota: bytes,
                                });
                            })}
                            className="grid w-full gap-4"
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('form.email_label')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                {...field}
                                                placeholder="email@cloubee.com"
                                                disabled={
                                                    addInvitationMutation.isPending
                                                }
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            {t('form.email_description')}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                                                min={1}
                                                max={maxQuota}
                                                {...field}
                                                disabled={
                                                    addInvitationMutation.isPending
                                                }
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            {t('form.quota_description', {
                                                maxQuota: maxQuota,
                                            })}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button
                                    isLoading={addInvitationMutation.isPending}
                                >
                                    {t('submit')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AddInvitationForm;
