'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
import { registerMutationFn } from '@/libs/api/auth-api';
import {
    TypeRegisterSchema,
    useRegisterSchema,
} from '@/schemas/auth/register.schema';

const RegisterForm = () => {
    const router = useRouter();

    const t = useTranslations('auth.registerAdmin');
    const registerSchema = useRegisterSchema();

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const form = useForm<TypeRegisterSchema>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const registerMutation = useMutation({
        mutationFn: registerMutationFn,
        onSuccess: () => {
            setErrorMsg(null);
            router.push('/home'); // TODO: update link
        },
        onError: () => {
            form.reset();
            setErrorMsg(t('error.registerError'));
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
                        const { confirmPassword, ...submitData } = data;
                        registerMutation.mutate(submitData);
                    })}
                    className="flex flex-col gap-6"
                >
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
                                        disabled={registerMutation.isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('emailLabel')}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="m@example.com"
                                        disabled={registerMutation.isPending}
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
                                        disabled={registerMutation.isPending}
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
                                        disabled={registerMutation.isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        className="w-full"
                        isLoading={registerMutation.isPending}
                    >
                        {t('submitButton')}
                    </Button>
                </form>
            </Form>
        </AuthWrapper>
    );
};

export default RegisterForm;
