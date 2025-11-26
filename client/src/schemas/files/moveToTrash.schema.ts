import { z } from 'zod';

export const MoveToTrashSchema = z.object({
    fileIds: z.array(z.string()).min(1),
});

export type TypeMoveToTrashSchema = z.infer<typeof MoveToTrashSchema>;
