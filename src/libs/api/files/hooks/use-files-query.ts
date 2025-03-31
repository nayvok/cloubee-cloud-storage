import { useQuery } from '@tanstack/react-query';

import { getFilesQueryFn } from '@/libs/api/files/files-api';
import { IFileResponse } from '@/libs/api/files/files.types';
import { QUERY_KEYS } from '@/libs/api/query-keys';

export const useFilesQuery = ({
    sortMode,
    sortDirection,
    idContext,
}: {
    sortMode: 'byName' | 'bySize' | 'byLastChange';
    sortDirection: 'asc' | 'desc';
    idContext?: string;
}) => {
    return useQuery<IFileResponse[]>({
        queryKey: [QUERY_KEYS.FILES, sortMode, sortDirection, idContext],
        queryFn: () => getFilesQueryFn(sortMode, sortDirection, idContext),
        staleTime: Infinity,
    });
};
