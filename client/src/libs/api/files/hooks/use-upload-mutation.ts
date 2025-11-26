import { useMutation, useQueryClient } from '@tanstack/react-query';

import { uploadMutationFn } from '@/libs/api/files/files-api';
import { QUERY_KEYS } from '@/libs/constants/query-keys';

export const useUploadMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadMutationFn,

        async onSettled() {
            queryClient.invalidateQueries({
                predicate: query => query.queryKey[0] === QUERY_KEYS.FILES,
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.USER],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.FREE_SPACE],
            });
        },
    });
};
