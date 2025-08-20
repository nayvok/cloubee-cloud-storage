import { RoleType } from '@/libs/constants/roles';

export interface IInvitation {
    id: string;
    email: string;
    token: string;
    role: RoleType;
    storageQuota: string;
    createdAt: Date;
}
