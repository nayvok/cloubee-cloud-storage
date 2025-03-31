import { useQuery } from '@tanstack/react-query';

import { getFilesQueryFn } from '@/libs/api/files/files-api';
import { IFileResponse } from '@/libs/api/files/files.types';
import { QUERY_KEYS } from '@/libs/api/query-keys';

export const useFilesQuery = ({
    idContext = 'base',
}: {
    idContext?: string;
}) => {
    return useQuery<IFileResponse[]>({
        queryKey: [QUERY_KEYS.FILES, idContext],
        queryFn: () => getFilesQueryFn(idContext),
        staleTime: Infinity,
    });
};
