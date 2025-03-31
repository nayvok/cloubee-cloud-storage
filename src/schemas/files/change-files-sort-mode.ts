import { z } from 'zod';

export const FileSortMode = ['byName', 'bySize', 'byLastChange'] as const;

export const changeFilesSortModeSchema = z.object({
    mode: z.enum(FileSortMode),
});

export type TypeChangeFilesSortModSchema = z.infer<
    typeof changeFilesSortModeSchema
>;

type FileSortModeItem = {
    title: string;
};

type FilesSortMods = Record<(typeof FileSortMode)[number], FileSortModeItem>;

export const filesSortMods: FilesSortMods = {
    byName: {
        title: 'По названию',
    },
    bySize: {
        title: 'По размеру',
    },
    byLastChange: {
        title: 'По последнему изменению',
    },
};
