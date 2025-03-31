import API from '@/libs/api/axios-client';
import { IFileResponse } from '@/libs/api/files/files.types';
import { API_ROUTES } from '@/libs/constants/api';
import { TypeMkdirSchema } from '@/schemas/files/mkdir.schema';

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
