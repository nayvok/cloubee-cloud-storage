import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { z } from 'zod';

export const useUpdateUserSchema = () => {
    const t = useTranslations('settings.user');

    const [updateUserSchema, setUpdateUserSchema] = useState(
        z.object({
            name: z.string().min(2, t('errors.name')).optional(),
            currentPassword: z
                .union([
                    z.string().min(8, { message: t('errors.password') }),
                    z.string().length(0),
                ])
                .optional()
                .transform(value => (value === '' ? undefined : value)),
            newPassword: z
                .union([
                    z.string().min(8, { message: t('errors.password') }),
                    z.string().length(0),
                ])
                .optional()
                .transform(value => (value === '' ? undefined : value)),
            avatarPath: z.string().optional(),
        }),
    );
    useEffect(() => {
        setUpdateUserSchema(
            z.object({
                name: z.string().min(2, t('errors.name')).optional(),
                currentPassword: z
                    .union([
                        z.string().min(8, { message: t('errors.password') }),
                        z.string().length(0),
                    ])
                    .optional()
                    .transform(value => (value === '' ? undefined : value)),
                newPassword: z
                    .union([
                        z.string().min(8, { message: t('errors.password') }),
                        z.string().length(0),
                    ])
                    .optional()
                    .transform(value => (value === '' ? undefined : value)),
                avatarPath: z.string().optional(),
            }),
        );
    }, [t]);

    return updateUserSchema;
};

export type TypeUpdateUserSchema = z.infer<
    ReturnType<typeof useUpdateUserSchema>
>;
