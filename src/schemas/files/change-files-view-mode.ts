import { Grid2X2, Grid3x3, List, LucideIcon } from 'lucide-react';
import { z } from 'zod';

export const FileViewMode = ['tile', 'largeTile', 'list'] as const;

export const changeFilesViewModeSchema = z.object({
    mode: z.enum(FileViewMode),
});

export type TypeChangeFilesViewModSchema = z.infer<
    typeof changeFilesViewModeSchema
>;

type FileViewModeItem = {
    icon: LucideIcon;
    title: string;
};

type FilesViewMods = Record<(typeof FileViewMode)[number], FileViewModeItem>;

export const filesViewMods: FilesViewMods = {
    largeTile: {
        icon: Grid2X2,
        title: 'Крупная плитка',
    },
    tile: {
        icon: Grid3x3,
        title: 'Плитка',
    },
    list: {
        icon: List,
        title: 'Список',
    },
};
