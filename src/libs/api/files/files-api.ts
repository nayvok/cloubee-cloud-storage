import API from '@/libs/api/axios-client';
import { IFileResponse, IUploadResponse } from '@/libs/api/files/files.types';
import { API_ROUTES } from '@/libs/constants/api';
import { TypeMkdirSchema } from '@/schemas/files/mkdir.schema';
import { TypeMoveToTrashSchema } from '@/schemas/files/moveToTrash.schema';
import { TypeRenameSchema } from '@/schemas/files/rename.schema';

export const getFilesQueryFn = async (
    sortMode: 'byName' | 'bySize' | 'byLastChange',
    sortDirection: 'asc' | 'desc',
    idContext?: string,
): Promise<IFileResponse[]> => {
    const response = await API.get<IFileResponse[]>(
        idContext
            ? `${API_ROUTES.FILES.LIST}/${idContext}`
            : API_ROUTES.FILES.LIST,
        {
            params: { sortMode, sortDirection },
        },
    );

    return response.data;
};

export const getThumbnailQueryFn = async (
    fileId: string,
    size: 'small' | 'medium' | 'large',
): Promise<Blob> => {
    const response = await API.get<Blob>(
        API_ROUTES.FILES.THUMBNAIL(fileId, size),
        {
            responseType: 'blob',
        },
    );
    return response.data;
};

export const mkdirMutationFn = async (data: TypeMkdirSchema) => {
    const response = await API.post(API_ROUTES.FILES.MKDIR, data);
    return response.data;
};

export const renameMutationFn = async (data: TypeRenameSchema) => {
    const response = await API.post(API_ROUTES.FILES.RENAME, data);
    return response.data;
};

export const moveToTrashMutationFn = async (data: TypeMoveToTrashSchema) => {
    const response = await API.post(API_ROUTES.FILES.SOFT_DELETE, data);
    return response.data;
};

export const uploadMutationFn = async (
    data: IUploadResponse & { abortController?: AbortController },
) => {
    const formData = new FormData();
    formData.append('file', data.file);

    const response = await API.post(
        `${API_ROUTES.FILES.UPLOAD}${data.idContext ? `?idContext=${data.idContext}&fileName=${data.file.name}&fileSize=${data.file.size}` : `?fileName=${data.file.name}&fileSize=${data.file.size}`}`,
        formData,
        {
            onUploadProgress: data.onUploadProgress || (() => {}),
            timeout: 900000,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            signal: data.abortController?.signal,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );

    return response.data;
};
