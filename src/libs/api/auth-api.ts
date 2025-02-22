import API from '@/libs/api/axios-client';
import { TypeInvitationSchema } from '@/schemas/auth/invitation.schema';
import { TypeRegisterSchema } from '@/schemas/auth/register.schema';
import { TypeSignInSchema } from '@/schemas/auth/sign-in.schema';

export const loginMutationFn = async (data: TypeSignInSchema) => {
    const response = await API.post('auth/login', data);
    return response.data;
};

export const registerMutationFn = async (
    data: Omit<TypeRegisterSchema, 'confirmPassword'>,
) => {
    const response = await API.post('auth/register-admin', data);
    return response.data;
};

export const invitationMutationFn = async (
    data: Omit<TypeInvitationSchema, 'confirmPassword'>,
) => {
    const response = await API.post('auth/register-invited', data);
    return response.data;
};
