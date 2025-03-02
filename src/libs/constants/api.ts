export const API_ROUTES = {
    USERS: {
        LIST: 'users/list',
        ME: 'users/me',
        BY_ID: (id: string) => `users/${id}`,
    },
    AUTH: {
        LOGIN: 'auth/login',
        LOGOUT: 'auth/logout',
        REGISTER_INVITED: 'auth/register-invited',
        REGISTER_ADMIN: 'auth/register-admin',
        IS_ADMIN_EXIST: 'auth/is-admin-exist',
        VALIDATE_REQUEST: 'auth/validate-request',
    },
    INVITES: {
        LIST: 'invites',
        CREATE: 'invites/create',
        CHECK: (token: string) => `invites/${token}`,
        DELETE: (id: string) => `invites/${id}`,
    },
    FILES: {
        LIST: 'files',
        TRASH: 'files/trash',
        MKDIR: 'files/mkdir',
        UPLOAD: 'files/upload',
        BY_ID: (fileId: string) => `files/${fileId}`,
        THUMBNAIL: (fileId: string, size: 'small' | 'medium' | 'large') =>
            `files/${fileId}/thumbnail/${size}`,
        RENAME: (fileId: string, fileName: string) =>
            `files/rename/${fileId}/${fileName}`,
        RESTORE: (fileId: string) => `files/trash/restore/${fileId}`,
        DELETE_PERMANENTLY: (fileId: string) => `files/trash/${fileId}`,
    },
};
