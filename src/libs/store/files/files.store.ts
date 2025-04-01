import { RefObject, createRef } from 'react';
import Selecto from 'react-selecto';
import { create } from 'zustand/react';

import { IFilesStore } from '@/libs/store/files/files.types';

export const filesStore = create<
    Omit<
        IFilesStore,
        | 'filesViewMode'
        | 'filesSortMode'
        | 'filesSortDirection'
        | 'setFilesViewMode'
        | 'setFilesSortMode'
        | 'setFilesSortDirection'
    >
>(set => ({
    selectedFiles: [],
    lastSelectedFiles: [],
    setLastSelectedFiles: lastSelectedFiles => set({ lastSelectedFiles }),
    setSelectedFiles: selectedFiles => set({ selectedFiles }),

    addSelectedFile: fileId =>
        set(state => ({
            selectedFiles: [...state.selectedFiles, fileId],
        })),

    removeSelectedFile: fileId =>
        set(state => ({
            selectedFiles: state.selectedFiles.filter(id => id !== fileId),
        })),

    headerActionBarRef: createRef<HTMLDivElement>(),
    setHeaderActionBarRef: (
        headerActionBarRef: RefObject<HTMLDivElement | null>,
    ) => set({ headerActionBarRef }),

    selectoRef: createRef<Selecto>(),
    setSelectoRef: (selectoRef: RefObject<Selecto | null>) =>
        set({ selectoRef }),
}));
