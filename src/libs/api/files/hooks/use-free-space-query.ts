import { useQuery } from '@tanstack/react-query';

import { getFreeSpaceQueryFn } from '@/libs/api/files/files-api';
import { QUERY_KEYS } from '@/libs/constants/query-keys';

export const useFreeSpaceQuery = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.FREE_SPACE],
        queryFn: () => getFreeSpaceQueryFn(),
    });
};
