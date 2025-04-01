import { RefObject } from 'react';

import { IFileResponse } from '@/libs/api/files/files.types';
import { TypeChangeFilesSortModeSchema } from '@/schemas/files/change-files-sort-mode.schema';
import { TypeChangeFilesViewModeSchema } from '@/schemas/files/change-files-view-mode.schema';

export interface IFilesStore {
    filesViewMode: TypeChangeFilesViewModeSchema['mode'];
    setFilesViewMode: (value: TypeChangeFilesViewModeSchema['mode']) => void;

    filesSortMode: TypeChangeFilesSortModeSchema['mode'];
    setFilesSortMode: (value: TypeChangeFilesSortModeSchema['mode']) => void;

    filesSortDirection: 'asc' | 'desc';
    setFilesSortDirection: () => void;

    selectedFiles: IFileResponse[];
    setSelectedFiles: (selectedFiles: IFileResponse[]) => void;
    addSelectedFile: (file: IFileResponse) => void;
    removeSelectedFile: (file: IFileResponse) => void;

    headerActionBarRef: RefObject<HTMLDivElement | null>;
    setHeaderActionBarRef: (
        actionBarRef: RefObject<HTMLDivElement | null>,
    ) => void;
}
