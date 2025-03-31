import { RefObject } from 'react';

import { IFileResponse } from '@/libs/api/files/files.types';
import { TypeChangeFilesSortModSchema } from '@/schemas/files/change-files-sort-mode.schema';
import { TypeChangeFilesViewModSchema } from '@/schemas/files/change-files-view-mode.schema';

export interface IFilesStore {
    filesViewMode: TypeChangeFilesViewModSchema['mode'];
    setFilesViewMode: (value: TypeChangeFilesViewModSchema['mode']) => void;

    filesSortMode: TypeChangeFilesSortModSchema['mode'];
    setFilesSortMode: (value: TypeChangeFilesSortModSchema['mode']) => void;

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
