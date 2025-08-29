import { useQuery } from '@tanstack/react-query';

import { getTrashQueryFn } from '@/libs/api/files/files-api';
import { IFileResponse } from '@/libs/api/files/files.types';
import { QUERY_KEYS } from '@/libs/constants/query-keys';

export const useTrashQuery = () => {
    return useQuery<IFileResponse[]>({
        queryKey: [QUERY_KEYS.TRASH],
        queryFn: () => getTrashQueryFn(),
        staleTime: Infinity,
    });
};
