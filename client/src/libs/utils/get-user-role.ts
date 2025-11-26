'use server';

import { cookies } from 'next/headers';

import { IUserResponse } from '@/libs/api/users/users.types';
import { API_ROUTES } from '@/libs/constants/api';

export async function getUserRole() {
    const cookiesStore = await cookies();

    const token = cookiesStore.get('access_token')?.value;

    const data: IUserResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/${API_ROUTES.USERS.ME}`,
        {
            cache: 'no-store',
            headers: {
                Cookie: `access_token=${token}`,
            },
        },
    ).then(response => response.json());

    return data.role;
}
