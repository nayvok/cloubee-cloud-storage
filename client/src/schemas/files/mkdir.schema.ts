import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { z } from 'zod';

export const useMkdirSchema = () => {
    const t = useTranslations('files.mkdir');

    const [mkdirSchema, setMkdirSchema] = useState(
        z.object({
            folderName: z
                .string()
                .nonempty({ message: t('error.nameRequired') }),
            idContext: z.string().optional(),
        }),
    );

    useEffect(() => {
        setMkdirSchema(
            z.object({
                folderName: z
                    .string()
                    .nonempty({ message: t('error.nameRequired') }),
                idContext: z.string().optional(),
            }),
        );
    }, [t]);

    return mkdirSchema;
};

export type TypeMkdirSchema = z.infer<ReturnType<typeof useMkdirSchema>>;
