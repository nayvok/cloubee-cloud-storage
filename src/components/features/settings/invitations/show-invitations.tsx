'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Mail, MoreHorizontal, Plus, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import AddInvitationForm from '@/components/features/settings/invitations/forms/add-invitation-form';
import SettingsCard from '@/components/features/settings/settings-card';
import SettingsLoader from '@/components/features/settings/settings-loader';
import { Badge } from '@/components/ui/common/badge';
import { Button } from '@/components/ui/common/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/common/dropdown-menu';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/common/table';
import { useInvitationsQuery } from '@/libs/api/invitations/hooks/use-invitations-query';
import { deleteInvitationMutationFn } from '@/libs/api/invitations/invitations-api';
import { IInvitation } from '@/libs/api/invitations/invitations.types';
import { QUERY_KEYS } from '@/libs/api/query-keys';
import { convertBytes } from '@/libs/utils/convert-bytes';

const ShowInvitations = () => {
    const t = useTranslations('settings.invitations');
    const { data, isPending } = useInvitationsQuery();
    const queryClient = useQueryClient();

    const [isAddInvitationFormOpen, setIsAddInvitationFormOpen] =
        useState(false);

    const onCopyInvitation = async (link: string) => {
        try {
            await navigator.clipboard.writeText(
                `${window.location.origin}/invitation?token=${link}`,
            );
            toast.success(t('table.toast.copy_success'), {
                duration: 2000,
            });
        } catch {
            toast.error(t('table.toast.copy_error'), { duration: 2000 });
        }
    };

    const deleteInvitationMutation = useMutation({
        mutationFn: deleteInvitationMutationFn,

        onMutate: async (deletedInvitation: string) => {
            await queryClient.cancelQueries({
                queryKey: [QUERY_KEYS.INVITATIONS],
            });

            const previousInvitations = queryClient.getQueryData([
                QUERY_KEYS.INVITATIONS,
            ]) as IInvitation[];

            queryClient.setQueryData(
                [QUERY_KEYS.INVITATIONS],
                previousInvitations.filter(
                    invitation => invitation.id !== deletedInvitation,
                ),
            );

            return { previousInvitations };
        },

        onError: (error, deletedInvitation, context) => {
            queryClient.setQueryData(
                [QUERY_KEYS.INVITATIONS],
                context?.previousInvitations,
            );

            toast.error(toast.success(t('table.toast.delete_error')), {
                duration: 2000,
            });
        },

        async onSuccess() {
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.USER],
            });
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.FREE_SPACE],
            });

            toast.success(t('table.toast.delete_success'));
        },
    });

    const onDeleteInvitation = (id: string) => {
        deleteInvitationMutation.mutate(id);
    };

    return (
        <SettingsCard
            icon={Mail}
            title={t('title')}
            description={t('description')}
        >
            {isPending ? (
                <SettingsLoader />
            ) : (
                <>
                    {data && data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3">
                            <Users className="size-8" />
                            <p>{t('placeholder')}</p>
                            <Button
                                onClick={() => setIsAddInvitationFormOpen(true)}
                            >
                                <Plus />
                                {t('invite_btn')}
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div>
                                <Table>
                                    <TableCaption>
                                        {t('table.caption')}
                                    </TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">
                                                {t('table.head.email')}
                                            </TableHead>
                                            <TableHead className="text-center">
                                                {t('table.head.role')}
                                            </TableHead>
                                            <TableHead className="text-center">
                                                {t('table.head.quota')}
                                            </TableHead>
                                            <TableHead className="text-center">
                                                {t('table.head.created_at')}
                                            </TableHead>
                                            <TableHead className="text-right">
                                                {t('table.head.actions')}
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data?.map(invitation => {
                                            return (
                                                <TableRow key={invitation.id}>
                                                    <TableCell className="w-[100px]">
                                                        {invitation.email}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge
                                                            variant={
                                                                invitation.role ===
                                                                'ADMIN'
                                                                    ? 'default'
                                                                    : 'secondary'
                                                            }
                                                        >
                                                            {invitation.role.toLowerCase()}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant="secondary">
                                                            {convertBytes(
                                                                Number(
                                                                    invitation.storageQuota,
                                                                ),
                                                            )}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {format(
                                                            new Date(
                                                                invitation.createdAt,
                                                            ),
                                                            'dd.MM.yyyy, HH:mm',
                                                        )}
                                                    </TableCell>

                                                    <TableCell className="flex justify-end text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        onCopyInvitation(
                                                                            invitation.token,
                                                                        )
                                                                    }
                                                                >
                                                                    {t(
                                                                        'table.dropdown.copy',
                                                                    )}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        onDeleteInvitation(
                                                                            invitation.id,
                                                                        )
                                                                    }
                                                                >
                                                                    {t(
                                                                        'table.dropdown.delete',
                                                                    )}
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="mr-4 flex w-full flex-row flex-wrap justify-end gap-2">
                                <Button
                                    onClick={() =>
                                        setIsAddInvitationFormOpen(true)
                                    }
                                >
                                    <Plus />
                                    {t('invite_btn')}
                                </Button>
                            </div>
                        </>
                    )}

                    <AddInvitationForm
                        isOpen={isAddInvitationFormOpen}
                        onClose={() => setIsAddInvitationFormOpen(false)}
                    />
                </>
            )}
        </SettingsCard>
    );
};

export default ShowInvitations;
