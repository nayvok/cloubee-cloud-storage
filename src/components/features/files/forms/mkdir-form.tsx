import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/common/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/common/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/common/form';
import { Input } from '@/components/ui/common/input';
import { mkdirMutationFn } from '@/libs/api/files/files-api';
import { QUERY_KEYS } from '@/libs/api/query-keys';
import { filesPersistStore } from '@/libs/store/files/files.persist-store';
import { TypeMkdirSchema, useMkdirSchema } from '@/schemas/files/mkdir.schema';

interface MkdirFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const MkdirForm = ({ isOpen, onClose }: MkdirFormProps) => {
    const t = useTranslations('files.mkdir');
    const pathname = usePathname()
        .split('/')
        .filter(Boolean)
        .slice(2)
        .join('/');

    const mkdirSchema = useMkdirSchema();
    const queryClient = useQueryClient();

    const filesSortMode = filesPersistStore(state => state.filesSortMode);
    const filesSortDirection = filesPersistStore(
        state => state.filesSortDirection,
    );

    const form = useForm<TypeMkdirSchema>({
        resolver: zodResolver(mkdirSchema),
        defaultValues: {
            folderName: 'Новая папка',
        },
    });

    const { setError, clearErrors } = form;

    const mkdirMutation = useMutation({
        mutationFn: mkdirMutationFn,
        onSuccess: () => {
            onClose();
        },
        onError: (error: Error) => {
            if (error.message === 'NAME_ALREADY_TAKEN') {
                setError('folderName', {
                    type: 'manual',
                    message: t('error.nameAlreadyTaken'),
                });
            } else {
                setError('folderName', {
                    type: 'manual',
                    message: t('error.mkdirError'),
                });
            }
        },
        async onSettled() {
            await queryClient.invalidateQueries({
                queryKey: [
                    QUERY_KEYS.FILES,
                    filesSortMode,
                    filesSortDirection,
                    decodeURIComponent(pathname),
                ],
            });
        },
    });

    const onSubmit = ({ folderName }: TypeMkdirSchema) => {
        clearErrors('folderName');
        if (pathname) {
            mkdirMutation.mutate({
                folderName,
                idContext: decodeURIComponent(pathname),
            });
        } else {
            mkdirMutation.mutate({
                folderName,
            });
        }
    };

    useEffect(() => {
        if (isOpen) {
            form.reset({ folderName: t('defaultName') });
        }
    }, [isOpen, form, t]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                aria-describedby={undefined}
                className="sm:max-w-[425px]"
            >
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid w-full gap-4"
                    >
                        <FormField
                            control={form.control}
                            name="folderName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            disabled={mkdirMutation.isPending}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="submit"
                                isLoading={mkdirMutation.isPending}
                            >
                                {t('create')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default MkdirForm;
