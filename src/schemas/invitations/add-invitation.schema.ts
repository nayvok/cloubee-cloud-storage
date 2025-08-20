import { useEffect, useState } from 'react';
import { z } from 'zod';

export const useAddInvitationSchema = () => {
    const [addInvitationSchema, setAddInvitationSchema] = useState(
        z.object({
            email: z.string().email(),
            storageQuota: z
                .string()
                .transform(value => (value === '' ? 0 : Number(value))),
        }),
    );

    useEffect(() => {
        setAddInvitationSchema(
            z.object({
                email: z.string().email(),
                storageQuota: z
                    .string()
                    .transform(value => (value === '' ? 0 : Number(value))),
            }),
        );
    }, []);

    return addInvitationSchema;
};

export type TypeAddInvitationSchema = z.infer<
    ReturnType<typeof useAddInvitationSchema>
>;
