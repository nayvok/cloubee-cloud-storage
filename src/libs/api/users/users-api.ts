import API from '@/libs/api/axios-client';
import { IUserResponse } from '@/libs/api/users/users.types';
import { API_ROUTES } from '@/libs/constants/api';

export const getUserQueryFn = async (): Promise<IUserResponse> => {
    const response = await API.get<IUserResponse>(API_ROUTES.USERS.ME);
    return response.data;
};
