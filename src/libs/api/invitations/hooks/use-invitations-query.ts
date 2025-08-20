import { useQuery } from '@tanstack/react-query';

import { getInvitationsQueryFn } from '@/libs/api/invitations/invitations-api';
import { QUERY_KEYS } from '@/libs/api/query-keys';

export const useInvitationsQuery = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.INVITATIONS],
        queryFn: () => getInvitationsQueryFn(),
        staleTime: Infinity,
    });
};
