import { Grid2X2, Grid3x3, List, LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

export const FileViewMode = ['tile', 'largeTile', 'list'] as const;

export const changeFilesViewModeSchema = z.object({
    mode: z.enum(FileViewMode),
});

export type TypeChangeFilesViewModeSchema = z.infer<
    typeof changeFilesViewModeSchema
>;

type FileViewModeItem = {
    icon: LucideIcon;
    title: string;
};

export const useFilesViewModes = () => {
    const t = useTranslations('layouts.header.filesSortingForm.viewMode');

    const filesViewModes: Record<
        (typeof FileViewMode)[number],
        FileViewModeItem
    > = {
        largeTile: {
            icon: Grid2X2,
            title: t('largeTile'),
        },
        tile: {
            icon: Grid3x3,
            title: t('tile'),
        },
        list: {
            icon: List,
            title: t('list'),
        },
    };

    return {
        filesViewModes,
    };
};
