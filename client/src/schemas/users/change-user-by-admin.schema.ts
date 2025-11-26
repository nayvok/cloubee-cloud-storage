import { z } from 'zod';

export const changeUserByAdminSchema = z.object({
    id: z.string().optional(),
    storageQuota: z
        .string()
        .transform(value => (value === '' ? 0 : Number(value))),
});

export type TypeChangeUserByAdminSchema = z.infer<
    typeof changeUserByAdminSchema
>;
