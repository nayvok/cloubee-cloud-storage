export enum ROLE_TYPES {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

export type RoleType = keyof typeof ROLE_TYPES;
