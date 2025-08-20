'use client';

import { format } from 'date-fns';
import { MoreHorizontal, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import SettingsCard from '@/components/features/settings/settings-card';
import SettingsLoader from '@/components/features/settings/settings-loader';
import DeleteUserAlert from '@/components/features/settings/users/forms/delete-user-alert';
import EditUserByAdminForm from '@/components/features/settings/users/forms/edit-user-by-admin-form';
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
import { useUsersQuery } from '@/libs/api/users/hooks/use-users-query';
import { IUserResponse } from '@/libs/api/users/users.types';
import { ROLE_TYPES } from '@/libs/constants/roles';
import { convertBytes } from '@/libs/utils/convert-bytes';

const ShowUsers = () => {
    const { data, isPending } = useUsersQuery();
    const t = useTranslations('settings.users');

    const [isDeleteUserFormOpen, setIsDeleteUserFormOpen] = useState(false);
    const [isEditUserByAdminFormOpen, setIsEditUserByAdminFormOpen] =
        useState(false);
    const [selectedUser, setSelectedUser] = useState<IUserResponse | null>(
        null,
    );

    return (
        <SettingsCard
            icon={Users}
            title={t('title')}
            description={t('description')}
        >
            {isPending ? (
                <SettingsLoader />
            ) : (
                <>
                    {data && data.length > 0 && (
                        <Table>
                            <TableCaption>{t('table.caption')}</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">
                                        {t('table.head.email')}
                                    </TableHead>
                                    <TableHead className="text-center">
                                        {t('table.head.name')}
                                    </TableHead>
                                    <TableHead className="text-center">
                                        {t('table.head.role')}
                                    </TableHead>
                                    <TableHead className="text-center">
                                        {t('table.head.used_quota')}
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
                                {data.map(user => {
                                    return (
                                        <TableRow key={user.id}>
                                            <TableCell className="w-[100px]">
                                                {user.email}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {user.name}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant={
                                                        user.role === 'ADMIN'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {user.role.toLowerCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary">
                                                    {convertBytes(
                                                        Number(user.usedQuota),
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary">
                                                    {convertBytes(
                                                        Number(
                                                            user.storageQuota,
                                                        ),
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {format(
                                                    new Date(user.createdAt),
                                                    'dd.MM.yyyy, HH:mm',
                                                )}
                                            </TableCell>

                                            <TableCell className="flex justify-end text-right">
                                                {user.role !==
                                                    ROLE_TYPES.ADMIN && (
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
                                                                onClick={() => {
                                                                    setSelectedUser(
                                                                        user,
                                                                    );
                                                                    setIsEditUserByAdminFormOpen(
                                                                        true,
                                                                    );
                                                                }}
                                                            >
                                                                {t(
                                                                    'table.dropdown.edit',
                                                                )}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setSelectedUser(
                                                                        user,
                                                                    );
                                                                    setIsDeleteUserFormOpen(
                                                                        true,
                                                                    );
                                                                }}
                                                            >
                                                                {t(
                                                                    'table.dropdown.delete',
                                                                )}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </>
            )}
            <DeleteUserAlert
                isOpen={isDeleteUserFormOpen}
                onClose={() => setIsDeleteUserFormOpen(false)}
                userData={selectedUser}
            />
            <EditUserByAdminForm
                isOpen={isEditUserByAdminFormOpen}
                onClose={() => setIsEditUserByAdminFormOpen(false)}
                userData={selectedUser}
            />
        </SettingsCard>
    );
};

export default ShowUsers;
