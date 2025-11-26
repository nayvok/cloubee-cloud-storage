import * as crypto from 'crypto';

export function getGravatarHash(email: string) {
    email = email.trim().toLowerCase();
    return crypto.createHash('sha256').update(email).digest('hex');
}
