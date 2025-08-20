import API from '@/libs/api/axios-client';
import { IUserResponse } from '@/libs/api/users/users.types';
import { API_ROUTES } from '@/libs/constants/api';
import { TypeChangeUserByAdminSchema } from '@/schemas/users/change-user-by-admin.schema';

export const getUserQueryFn = async (): Promise<IUserResponse> => {
    const response = await API.get<IUserResponse>(API_ROUTES.USERS.ME);
    return response.data;
};

export const getUsersQueryFn = async (): Promise<IUserResponse[]> => {
    const response = await API.get<IUserResponse[]>(API_ROUTES.USERS.LIST);
    return response.data;
};

export const deleteUserMutationFn = async (id: string) => {
    const response = await API.delete(API_ROUTES.USERS.DELETE(id));
    return response.data;
};

export const changeUserByAdminMutationFn = async (
    data: TypeChangeUserByAdminSchema,
) => {
    const response = await API.post(`${API_ROUTES.USERS.BY_ID}/${data.id}`, {
        storageQuota: data.storageQuota,
    });
    return response.data;
};
