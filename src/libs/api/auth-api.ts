import API from '@/libs/api/axios-client';
import { TypeSignInSchema } from '@/schemas/auth/sign-in.schema';

export const loginMutationFn = async (data: TypeSignInSchema) => {
    const response = await API.post('auth/login', data);
    return response.data;
};
