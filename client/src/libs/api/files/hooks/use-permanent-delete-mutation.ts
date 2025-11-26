import { useMutation, useQueryClient } from '@tanstack/react-query';

import { permanentMutationFn } from '@/libs/api/files/files-api';
import { IFileResponse } from '@/libs/api/files/files.types';
import { QUERY_KEYS } from '@/libs/constants/query-keys';

export const usePermanentDeleteMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: permanentMutationFn,
        onMutate: async ({ fileIds, deleteAll }) => {
            await queryClient.cancelQueries({
                queryKey: [QUERY_KEYS.TRASH],
            });

            const previousFiles = queryClient.getQueryData([
                QUERY_KEYS.TRASH,
            ]) as IFileResponse[];

            if (deleteAll) {
                queryClient.setQueryData([QUERY_KEYS.TRASH], []);
            } else {
                queryClient.setQueryData(
                    [QUERY_KEYS.TRASH],
                    previousFiles.filter(
                        previousFile => !fileIds.includes(previousFile.id),
                    ),
                );
            }

            return { previousFiles };
        },

        async onSettled() {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.TRASH],
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
