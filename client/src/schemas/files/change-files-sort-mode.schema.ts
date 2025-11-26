import { useTranslations } from 'next-intl';
import { z } from 'zod';

export const FileSortMode = ['byName', 'bySize', 'byLastChange'] as const;

export const changeFilesSortModeSchema = z.object({
    mode: z.enum(FileSortMode),
});

export type TypeChangeFilesSortModeSchema = z.infer<
    typeof changeFilesSortModeSchema
>;

type FileSortModeItem = {
    title: string;
};

export const useFilesSortModes = () => {
    const t = useTranslations('layouts.header.filesSortingForm.sortMode');

    const filesSortModes: Record<
        (typeof FileSortMode)[number],
        FileSortModeItem
    > = {
        byName: {
            title: t('byName'),
        },
        bySize: {
            title: t('bySize'),
        },
        byLastChange: {
            title: t('byLastChange'),
        },
    };

    return {
        filesSortModes,
    };
};
