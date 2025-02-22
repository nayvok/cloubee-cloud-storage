import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { z } from 'zod';

export const useInvitationSchema = () => {
    const t = useTranslations('auth.invitation');

    const [invitationSchema, setInvitationSchema] = useState(
        z
            .object({
                token: z.string(),
                name: z
                    .string()
                    .nonempty({ message: t('error.nameRequired') })
                    .min(2, t('error.name')),
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
        setInvitationSchema(
            z
                .object({
                    token: z.string(),
                    name: z
                        .string()
                        .nonempty({ message: t('error.nameRequired') })
                        .min(2, t('error.name')),
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

    return invitationSchema;
};

export type TypeInvitationSchema = z.infer<
    ReturnType<typeof useInvitationSchema>
>;
