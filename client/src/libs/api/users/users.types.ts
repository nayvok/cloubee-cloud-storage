import { RoleType } from '@/libs/constants/roles';

export interface IUserResponse {
    id: string;
    name: string;
    email: string;
    role: RoleType;
    avatarPath?: string;
    createdAt: Date;
    usedQuota: string;
    storageQuota: string;
}
