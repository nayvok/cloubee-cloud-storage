'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import AuthWrapper from '@/components/features/auth/auth-wrapper';
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
import { invitationMutationFn } from '@/libs/api/auth/auth-api';
import API from '@/libs/api/axios-client';
import { APP_ROUTES } from '@/libs/constants/routes';
import {
    TypeInvitationSchema,
    useInvitationSchema,
} from '@/schemas/auth/invitation.schema';

const InvitationForm = () => {
    const router = useRouter();

    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [invitationEmail, setInvitationEmail] = useState('');

    if (!token) {
        redirect(APP_ROUTES.LOGIN);
    }

    useEffect(() => {
        if (token) {
            API.get(`/invites/${token}`)
                .then(res => setInvitationEmail(res.data))
                .catch(() => redirect(APP_ROUTES.LOGIN));
        }
    }, [token]);

    const t = useTranslations('auth.invitation');
    const invitationSchema = useInvitationSchema();

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const form = useForm<TypeInvitationSchema>({
        resolver: zodResolver(invitationSchema),
        defaultValues: {
            token: token,
            name: '',
            password: '',
            confirmPassword: '',
        },
    });

    const invitationMutation = useMutation({
        mutationFn: invitationMutationFn,
        onSuccess: () => {
            setErrorMsg(null);
            router.push(APP_ROUTES.DASHBOARD.FILES.path);
        },
        onError: () => {
            form.reset();
            setErrorMsg(t('error.invitationError'));
        },
    });

    return (
        <AuthWrapper
            title={t('title')}
            description={t('description')}
            errorMessage={errorMsg}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(data => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { confirmPassword, ...submitData } = data;
                        invitationMutation.mutate(submitData);
                    })}
                    className="flex flex-col gap-6"
                >
                    <FormItem>
                        <FormLabel>{t('emailLabel')}</FormLabel>
                        <FormControl>
                            <Input
                                type="email"
                                disabled
                                value={invitationEmail}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('nameLabel')}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="name"
                                        placeholder="Cloubee"
                                        disabled={invitationMutation.isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('passwordLabel')}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="********"
                                        disabled={invitationMutation.isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t('confirmPasswordLabel')}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="********"
                                        disabled={invitationMutation.isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        className="w-full"
                        isLoading={invitationMutation.isPending}
                    >
                        {t('submitButton')}
                    </Button>
                </form>
            </Form>
        </AuthWrapper>
    );
};

export default InvitationForm;
