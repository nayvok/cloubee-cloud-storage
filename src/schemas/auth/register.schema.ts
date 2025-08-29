import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { z } from 'zod';

export const useRegisterSchema = () => {
    const t = useTranslations('auth.register');

    const [registerSchema, setRegisterSchema] = useState(
        z
            .object({
                name: z
                    .string()
                    .nonempty({ message: t('error.nameRequired') })
                    .min(2, t('error.name')),
                email: z
                    .string()
                    .nonempty({ message: t('error.emailRequired') })
                    .email({ message: t('error.email') }),
                password: z
                    .string()
                    .nonempty({ message: t('error.passwordRequired') })
                    .min(8, { message: t('error.password') }),
                confirmPassword: z.string(),
            })
            .refine(data => data.confirmPassword === data.password, {
                message: t('error.confirmPassword'),
                path: ['confirmPassword'],
            }),
    );

    useEffect(() => {
        setRegisterSchema(
            z
                .object({
                    name: z
                        .string()
                        .nonempty({ message: t('error.nameRequired') })
                        .min(2, t('error.name')),
                    email: z
                        .string()
                        .nonempty({ message: t('error.emailRequired') })
                        .email({ message: t('error.email') }),
                    password: z
                        .string()
                        .nonempty({ message: t('error.passwordRequired') })
                        .min(8, { message: t('error.password') }),
                    confirmPassword: z.string(),
                })
                .refine(data => data.confirmPassword === data.password, {
                    message: t('error.confirmPassword'),
                    path: ['confirmPassword'],
                }),
        );
    }, [t]);

    return registerSchema;
};

export type TypeRegisterSchema = z.infer<ReturnType<typeof useRegisterSchema>>;
