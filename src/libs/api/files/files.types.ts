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
