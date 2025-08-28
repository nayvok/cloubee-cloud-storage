'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import SettingsCard from '@/components/features/settings/settings-card';
import SettingsLoader from '@/components/features/settings/settings-loader';
import { Avatar, AvatarFallback } from '@/components/ui/common/avatar';
import { Button } from '@/components/ui/common/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/common/form';
import { Input } from '@/components/ui/common/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/common/radio-group';
import { QUERY_KEYS } from '@/libs/api/query-keys';
import { useUserQuery } from '@/libs/api/users/hooks/use-user-query';
import { updateUserMutationFn } from '@/libs/api/users/users-api';
import { LOCAL_AVATARS } from '@/libs/constants/local-avatars';
import { getFallbackAvatarInitials } from '@/libs/utils/getFallbackAvatarInitials';
import { getGravatarHash } from '@/libs/utils/getGravatarHash';
import {
    TypeUpdateUserSchema,
    useUpdateUserSchema,
} from '@/schemas/user/update-user.schema';

const ShowUser = () => {
    const t = useTranslations('settings.user');
    const { data: userData, isPending } = useUserQuery();
    const queryClient = useQueryClient();
    const registerSchema = useUpdateUserSchema();

    const [gravatarHash, setGravatarHash] = useState('');

    const availableAvatars: string[] = useMemo(() => {
        if (gravatarHash === '') return LOCAL_AVATARS;
        return LOCAL_AVATARS.concat([
            `https://www.gravatar.com/avatar/${gravatarHash}`,
        ]);
    }, [gravatarHash]);

    const form = useForm<TypeUpdateUserSchema>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: userData?.name || '',
            currentPassword: '',
            newPassword: '',
            avatarPath: userData?.avatarPath || '',
        },
    });

    const updateUserMutation = useMutation({
        mutationFn: updateUserMutationFn,

        onError: (error: Error) => {
            if (error.message === 'INVALID_PASSWORD') {
                toast.error(t('errors.invalid_password'));
            } else if (error.message === 'NEW_PASSWORD_REQUIRED') {
                toast.error(t('errors.new_password_required'));
            } else {
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

            toast.success(t('success'));
        },

        onSettled() {
            form.reset({
                name: userData?.name || '',
                currentPassword: '',
                newPassword: '',
                avatarPath: userData?.avatarPath || '',
            });
        },
    });

    useEffect(() => {
        if (userData) {
            form.reset({
                name: userData?.name || '',
                currentPassword: '',
                newPassword: '',
                avatarPath: userData?.avatarPath || '',
            });

            setGravatarHash(getGravatarHash(userData?.email));
        }
    }, [form, userData]);

    return (
        <SettingsCard
            icon={User}
            title={t('title')}
            description={t('description')}
        >
            {isPending ? (
                <SettingsLoader />
            ) : (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(data =>
                            updateUserMutation.mutate(data),
                        )}
                        className="flex grow flex-col gap-6"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.name')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="name"
                                            placeholder="Cloubee"
                                            disabled={
                                                updateUserMutation.isPending
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t('form.current_password')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            autoComplete="off"
                                            placeholder="********"
                                            disabled={
                                                updateUserMutation.isPending
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t('form.new_password')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="********"
                                            disabled={
                                                updateUserMutation.isPending
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="avatarPath"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.avatar')}</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                            className="flex flex-row flex-wrap gap-2 max-xl:justify-center"
                                        >
                                            <FormItem key="fallback">
                                                <FormLabel className="[&:has([data-state=checked])>.avatar-fallback]:border-primary cursor-pointer [&:has([data-state=checked])>.avatar-fallback]:border-2 [&:has([data-state=checked])>.avatar-fallback]:p-0.5">
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            value=""
                                                            className="sr-only"
                                                        />
                                                    </FormControl>

                                                    <Avatar className="avatar-fallback hover:border-primary size-12 rounded-full border-2 transition-all">
                                                        <AvatarFallback className="bg-sidebar-accent">
                                                            {getFallbackAvatarInitials(
                                                                userData?.name,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </FormLabel>
                                            </FormItem>
                                            {availableAvatars.map(img => (
                                                <FormItem key={img}>
                                                    <FormLabel className="[&:has([data-state=checked])>img]:border-primary cursor-pointer [&:has([data-state=checked])>img]:border-2 [&:has([data-state=checked])>img]:p-0.5">
                                                        <FormControl>
                                                            <RadioGroupItem
                                                                value={img}
                                                                className="sr-only"
                                                            />
                                                        </FormControl>

                                                        <img
                                                            src={img}
                                                            alt="avatar"
                                                            className="hover:border-primary size-12 rounded-full border-2 transition-all"
                                                        />
                                                    </FormLabel>
                                                </FormItem>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="flex w-full justify-end">
                            <Button isLoading={updateUserMutation.isPending}>
                                {t('form.submit')}
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </SettingsCard>
    );
};

export default ShowUser;
