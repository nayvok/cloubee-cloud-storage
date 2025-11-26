import { useQuery } from '@tanstack/react-query';

import { getThumbnailQueryFn } from '@/libs/api/files/files-api';
import { QUERY_KEYS } from '@/libs/constants/query-keys';

export const useThumbnailQuery = ({
    fileId,
    size,
}: {
    fileId: string;
    size: 'small' | 'medium' | 'large';
}) => {
    return useQuery({
        queryKey: [QUERY_KEYS.THUMBNAIL, fileId, size],
        queryFn: () => getThumbnailQueryFn(fileId, size),
        staleTime: Infinity,
    });
};
