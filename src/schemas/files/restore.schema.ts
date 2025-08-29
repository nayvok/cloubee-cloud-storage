import { z } from 'zod';

export const RestoreSchema = z.object({
    fileIds: z.array(z.string()).min(1),
});

export type TypeRestoreSchema = z.infer<typeof RestoreSchema>;
