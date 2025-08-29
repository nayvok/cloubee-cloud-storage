import { useQuery } from '@tanstack/react-query';

import { getUsersQueryFn } from '@/libs/api/users/users-api';
import { QUERY_KEYS } from '@/libs/constants/query-keys';

export const useUsersQuery = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.USERS],
        queryFn: () => getUsersQueryFn(),
        staleTime: Infinity,
    });
};
