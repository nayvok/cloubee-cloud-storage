import { useQuery } from '@tanstack/react-query';

import { getUserQueryFn } from '@/libs/api/users/users-api';
import { QUERY_KEYS } from '@/libs/constants/query-keys';

export const useUserQuery = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.USER],
        queryFn: getUserQueryFn,
    });
};
