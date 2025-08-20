import API from '@/libs/api/axios-client';
import { IInvitation } from '@/libs/api/invitations/invitations.types';
import { API_ROUTES } from '@/libs/constants/api';
import { TypeAddInvitationSchema } from '@/schemas/invitations/add-invitation.schema';

export const getInvitationsQueryFn = async (): Promise<IInvitation[]> => {
    const response = await API.get<IInvitation[]>(API_ROUTES.INVITES.LIST);
    return response.data;
};

export const addInvitationMutationFn = async (
    data: TypeAddInvitationSchema,
) => {
    const response = await API.post(API_ROUTES.INVITES.CREATE, data);
    return response.data;
};

export const deleteInvitationMutationFn = async (id: string) => {
    const response = await API.delete(API_ROUTES.INVITES.DELETE(id));
    return response.data;
};
