import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/libs/api/query-keys';
import { getUserQueryFn } from '@/libs/api/users/users-api';

export const useUserQuery = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.USER],
        queryFn: getUserQueryFn,
    });
};
