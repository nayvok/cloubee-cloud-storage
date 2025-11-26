import { useMutation, useQueryClient } from '@tanstack/react-query';

import { restoreMutationFn } from '@/libs/api/files/files-api';
import { IFileResponse } from '@/libs/api/files/files.types';
import { QUERY_KEYS } from '@/libs/constants/query-keys';

export const useRestoreMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: restoreMutationFn,
        onMutate: async ({ fileIds }) => {
            await queryClient.cancelQueries({
                queryKey: [QUERY_KEYS.TRASH],
            });

            const previousFiles = queryClient.getQueryData([
                QUERY_KEYS.TRASH,
            ]) as IFileResponse[];

            queryClient.setQueryData(
                [QUERY_KEYS.TRASH],
                previousFiles.filter(
                    previousFile => !fileIds.includes(previousFile.id),
                ),
            );

            return { previousFiles };
        },

        async onSettled() {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.TRASH],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.FILES],
            });
        },
    });
};
