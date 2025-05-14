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
        MKDIR: 'files/mkdir',
        UPLOAD: 'files/upload',
        DOWNLOAD: 'files/file/download',
        THUMBNAIL: (fileId: string, size: 'small' | 'medium' | 'large') =>
            `files/thumbnail/${fileId}/${size}`,
        RENAME: 'files/rename',
        RESTORE: 'files/trash/restore',
        SOFT_DELETE: 'files/trash/soft',
        PERMANENT_DELETE: 'files/trash/permanent',
    },
};
