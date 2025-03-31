import { RoleType } from '@/libs/constants/roles';

export interface IUserResponse {
    id: string;
    name: string;
    email: string;
    role: RoleType;
    avatarPath?: string;
    usedQuota: string;
    storageQuota: string;
}
