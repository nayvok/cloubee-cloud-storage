import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/libs/api/query-keys';
import { getUserQueryFn } from '@/libs/api/users/users-api';
import { IUserResponse } from '@/libs/api/users/users.types';

export const useUserQuery = () => {
    return useQuery<IUserResponse>({
        queryKey: [QUERY_KEYS.USER],
        queryFn: getUserQueryFn,
    });
};
