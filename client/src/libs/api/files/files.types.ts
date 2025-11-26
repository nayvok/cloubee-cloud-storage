import { AxiosProgressEvent } from 'axios';

export interface IFileResponse {
    id: string;
    userId: string;
    name: string;
    mimeType: string | null;
    size: string;
    path: string;
    thumbnailLarge: string | null;
    thumbnailMedium: string | null;
    thumbnailSmall: string | null;
    directoryId: string | null;
    isDirectory: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUploadResponse {
    file: File;
    idContext?: string;
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

export interface IRestoreResponse {
    success: boolean;
    restored: {
        id: string;
        name: string;
    }[];
    errors: {
        fileId: string;
        code: string;
        message: string;
    }[];
}
