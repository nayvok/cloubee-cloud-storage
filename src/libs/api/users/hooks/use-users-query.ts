import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/libs/api/query-keys';
import { getUsersQueryFn } from '@/libs/api/users/users-api';

export const useUsersQuery = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.USERS],
        queryFn: () => getUsersQueryFn(),
        staleTime: Infinity,
    });
};
