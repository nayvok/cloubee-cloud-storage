import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { z } from 'zod';

export const useRenameSchema = () => {
    const t = useTranslations('files.rename');

    const [renameSchema, setRenameSchema] = useState(
        z.object({
            fileId: z.string().optional(),
            newName: z.string().nonempty({ message: t('error.nameRequired') }),
        }),
    );

    useEffect(() => {
        setRenameSchema(
            z.object({
                fileId: z.string().optional(),
                newName: z
                    .string()
                    .nonempty({ message: t('error.nameRequired') }),
            }),
        );
    }, [t]);

    return renameSchema;
};

export type TypeRenameSchema = z.infer<ReturnType<typeof useRenameSchema>>;
