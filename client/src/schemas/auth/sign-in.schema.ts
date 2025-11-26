import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { z } from 'zod';

export const useSignInSchema = () => {
    const t = useTranslations('auth.login');

    const [signInSchema, setSignInSchema] = useState(
        z.object({
            email: z
                .string()
                .nonempty({ message: t('error.emailRequired') })
                .email({ message: t('error.email') }),
            password: z
                .string()
                .nonempty({ message: t('error.passwordRequired') })
                .min(8, { message: t('error.password') }),
        }),
    );

    useEffect(() => {
        setSignInSchema(
            z.object({
                email: z
                    .string()
                    .nonempty({ message: t('error.emailRequired') })
                    .email({ message: t('error.email') }),
                password: z
                    .string()
                    .nonempty({ message: t('error.passwordRequired') })
                    .min(8, { message: t('error.password') }),
            }),
        );
    }, [t]);

    return signInSchema;
};

export type TypeSignInSchema = z.infer<ReturnType<typeof useSignInSchema>>;
