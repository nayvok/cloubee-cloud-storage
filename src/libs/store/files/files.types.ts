import { RefObject } from 'react';
import Selecto from 'react-selecto';

import { IUploadedFile } from '@/components/features/files/file-uploader-list';
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
    lastSelectedFiles: IFileResponse[];
    setSelectedFiles: (selectedFiles: IFileResponse[]) => void;
    setLastSelectedFiles: (files: IFileResponse[]) => void;
    addSelectedFile: (file: IFileResponse) => void;
    removeSelectedFile: (file: IFileResponse) => void;

    headerActionBarRef: RefObject<HTMLDivElement | null>;
    setHeaderActionBarRef: (
        headerActionBarRef: RefObject<HTMLDivElement | null>,
    ) => void;

    selectoRef: RefObject<Selecto | null>;
    setSelectoRef: (selectoRef: RefObject<Selecto | null>) => void;

    uploadedFiles: IUploadedFile[];
    setUploadedFile: (uploadedFile: IUploadedFile) => void;
    removeUploadedFile: (uploadedFile: Pick<IUploadedFile, 'fileName'>) => void;
    clearUploadedFiles: () => void;

    isFileUploaderListCollapsed: boolean;
    setIsFileUploaderListCollapsed: () => void;
}
