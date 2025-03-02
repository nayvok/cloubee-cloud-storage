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
import { loginMutationFn } from '@/libs/api/auth/auth-api';
import { APP_ROUTES } from '@/libs/constants/routes';
import {
    TypeSignInSchema,
    useSignInSchema,
} from '@/schemas/auth/sign-in.schema';

const SignInForm = () => {
    const router = useRouter();

    const t = useTranslations('auth.login');
    const signInSchema = useSignInSchema();

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const form = useForm<TypeSignInSchema>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const singInMutation = useMutation({
        mutationFn: loginMutationFn,
        onSuccess: () => {
            setErrorMsg(null);
            router.push(APP_ROUTES.DASHBOARD.FILES);
        },
        onError: (error: Error) => {
            form.reset();

            if (error.message === 'NOT_FOUND') {
                setErrorMsg(t('error.invalidCredentials'));
            } else {
                setErrorMsg(t('error.authError'));
            }
        },
    });

    return (
        <AuthWrapper
            title={t('title')}
            description={t('description')}
            errorMessage={errorMsg}
            additionalButtonHref="#" // TODO: Добавить ссылку для документации по восстановлению пароля
            additionalButtonLabel={t('forgotPassword')}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit((data: TypeSignInSchema) =>
                        singInMutation.mutate(data),
                    )}
                    className="flex flex-col gap-6"
                >
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
                                        disabled={singInMutation.isPending}
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
                                        disabled={singInMutation.isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        className="w-full"
                        isLoading={singInMutation.isPending}
                    >
                        {t('submitButton')}
                    </Button>
                </form>
            </Form>
        </AuthWrapper>
    );
};

export default SignInForm;
