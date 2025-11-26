import { z } from 'zod';

export const PermanentDeleteSchema = z.object({
    fileIds: z.array(z.string()).min(1),
    deleteAll: z.boolean(),
});

export type TypePermanentDeleteSchema = z.infer<typeof PermanentDeleteSchema>;
