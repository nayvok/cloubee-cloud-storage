import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

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
import { renameMutationFn } from '@/libs/api/files/files-api';
import { QUERY_KEYS } from '@/libs/api/query-keys';
import { filesPersistStore } from '@/libs/store/files/files.persist-store';
import { filesStore } from '@/libs/store/files/files.store';
import {
    TypeRenameSchema,
    useRenameSchema,
} from '@/schemas/files/rename.schema';

interface RenameFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const RenameForm = ({ isOpen, onClose }: RenameFormProps) => {
    const t = useTranslations('files.rename');
    const pathname = usePathname()
        .split('/')
        .filter(Boolean)
        .slice(2)
        .join('/');

    const queryClient = useQueryClient();
    const renameSchema = useRenameSchema();

    const lastSelectedFiles = filesStore(state => state.lastSelectedFiles);
    const filesSortMode = filesPersistStore(state => state.filesSortMode);
    const filesSortDirection = filesPersistStore(
        state => state.filesSortDirection,
    );

    const inputRef = useRef<HTMLInputElement>(null);
    const confirmExtensionAlertRef = useRef<(value: boolean) => void>(() => {});

    const [fileType, setFileType] = useState('');
    const [newNameFileType, setNewNameFileType] = useState('');
    const [isConfirmExtensionAlertOpen, setIsConfirmExtensionAlertOpen] =
        useState(false);

    const form = useForm<TypeRenameSchema>({
        resolver: zodResolver(renameSchema),
        defaultValues: {
            newName: lastSelectedFiles[0].name,
        },
    });

    const renameMutation = useMutation({
        mutationFn: renameMutationFn,

        onError: (error: Error) => {
            if (error.message === 'NAME_ALREADY_TAKEN') {
                form.setError('newName', {
                    type: 'manual',
                    message: t('error.nameAlreadyTaken'),
                });
            } else {
                form.setError('newName', {
                    type: 'manual',
                    message: t('error.renameError'),
                });
            }
        },

        async onSuccess() {
            await queryClient.invalidateQueries({
                queryKey: [
                    QUERY_KEYS.FILES,
                    filesSortMode,
                    filesSortDirection,
                    decodeURIComponent(pathname),
                ],
            });
            onClose();
        },
    });

    const confirmExtensionChange = (newNameType?: string): Promise<boolean> => {
        return new Promise(resolve => {
            setNewNameFileType(newNameType || '');
            setIsConfirmExtensionAlertOpen(true);
            confirmExtensionAlertRef.current = resolve;
        });
    };

    const handleAlertConfirm = () => {
        if (confirmExtensionAlertRef.current) {
            confirmExtensionAlertRef.current(true);
        }
        setIsConfirmExtensionAlertOpen(false);
    };

    const handleAlertCancel = () => {
        if (confirmExtensionAlertRef.current) {
            confirmExtensionAlertRef.current(false);
        }
        setIsConfirmExtensionAlertOpen(false);
    };

    const onSubmit = async ({ newName }: TypeRenameSchema) => {
        if (newName === lastSelectedFiles[0].name) {
            onClose();
        }

        if (lastSelectedFiles[0].isDirectory) {
            renameMutation.mutate({ fileId: lastSelectedFiles[0].id, newName });
        } else {
            const newNameDotIndex = newName.split('').lastIndexOf('.');

            if (newNameDotIndex !== -1) {
                const newNameType = newName.slice(newNameDotIndex);

                if (fileType && fileType === newNameType) {
                    renameMutation.mutate({
                        fileId: lastSelectedFiles[0].id,
                        newName,
                    });
                } else {
                    let isConfirm: boolean;

                    if (newNameType === '.') {
                        isConfirm = await confirmExtensionChange();
                    } else {
                        isConfirm = await confirmExtensionChange(newNameType);
                    }

                    if (isConfirm) {
                        renameMutation.mutate({
                            fileId: lastSelectedFiles[0].id,
                            newName,
                        });
                    } else {
                        const newFileNameWithOldExtension = newName
                            .slice(0, newNameDotIndex)
                            .concat(fileType);

                        form.reset({
                            newName: newFileNameWithOldExtension,
                        });

                        renameMutation.mutate({
                            fileId: lastSelectedFiles[0].id,
                            newName,
                        });
                    }
                }
            } else {
                const isConfirm = await confirmExtensionChange();

                if (isConfirm) {
                    renameMutation.mutate({
                        fileId: lastSelectedFiles[0].id,
                        newName,
                    });
                } else {
                    const newFileNameWithOldExtension = newName
                        .slice(0, newNameDotIndex)
                        .concat(fileType);

                    form.reset({
                        newName: newFileNameWithOldExtension,
                    });

                    renameMutation.mutate({
                        fileId: lastSelectedFiles[0].id,
                        newName,
                    });
                }
            }
        }
    };

    useEffect(() => {
        if (isOpen) {
            form.reset({ newName: lastSelectedFiles[0].name });

            if (inputRef.current) {
                const dotIndex = inputRef.current?.value
                    .split('')
                    .lastIndexOf('.');

                if (dotIndex !== -1) {
                    setFileType(inputRef.current?.value.slice(dotIndex));
                    setTimeout(() => {
                        inputRef.current?.setSelectionRange(0, dotIndex);
                    });
                }
            }
        }
    }, [isOpen, form, lastSelectedFiles, inputRef]);

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
                            name="newName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            {...field}
                                            autoComplete="off"
                                            disabled={renameMutation.isPending}
                                            ref={e => {
                                                field.ref(e);
                                                inputRef.current = e;
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="submit"
                                isLoading={renameMutation.isPending}
                            >
                                {t('save')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>

            <AlertDialog open={isConfirmExtensionAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t('confirmChangeExtension.title')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('confirmChangeExtension.description')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleAlertCancel}>
                            {t('confirmChangeExtension.cancel')} {fileType}
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleAlertConfirm}>
                            {newNameFileType
                                ? `${t('confirmChangeExtension.confirm')} ${newNameFileType}`
                                : t(
                                      'confirmChangeExtension.confirmRemoveExtension',
                                  )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Dialog>
    );
};

export default RenameForm;
