import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand/react';

import { IFilesStore } from '@/libs/store/files/files.types';

export const filesPersistStore = create(
    persist<
        Pick<
            IFilesStore,
            | 'filesViewMode'
            | 'setFilesViewMode'
            | 'filesSortMode'
            | 'setFilesSortMode'
            | 'filesSortDirection'
            | 'setFilesSortDirection'
        >
    >(
        (set, getState) => ({
            filesViewMode: 'tile',
            setFilesViewMode: value => set({ filesViewMode: value }),

            filesSortMode: 'byName',
            setFilesSortMode: value => set({ filesSortMode: value }),

            filesSortDirection: 'asc',
            setFilesSortDirection: () => {
                const currentDirection = getState().filesSortDirection;
                set({
                    filesSortDirection:
                        currentDirection === 'asc' ? 'desc' : 'asc',
                });
            },
        }),
        {
            name: 'files',
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
