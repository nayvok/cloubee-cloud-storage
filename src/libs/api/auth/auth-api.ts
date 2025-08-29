import API from '@/libs/api/axios-client';
import { API_ROUTES } from '@/libs/constants/api';
import { TypeInvitationSchema } from '@/schemas/auth/invitation.schema';
import { TypeRegisterSchema } from '@/schemas/auth/register.schema';
import { TypeSignInSchema } from '@/schemas/auth/sign-in.schema';

export const loginMutationFn = async (data: TypeSignInSchema) => {
    const response = await API.post(API_ROUTES.AUTH.LOGIN, data);
    return response.data;
};

export const registerMutationFn = async (
    data: Omit<TypeRegisterSchema, 'confirmPassword'>,
) => {
    const response = await API.post(API_ROUTES.AUTH.REGISTER_ADMIN, data);
    return response.data;
};

export const invitationMutationFn = async (
    data: Omit<TypeInvitationSchema, 'confirmPassword'>,
) => {
    const response = await API.post(API_ROUTES.AUTH.REGISTER_INVITED, data);
    return response.data;
};

export const logoutMutationFn = async () => {
    const response = await API.post(API_ROUTES.AUTH.LOGOUT);
    return response.data;
};
