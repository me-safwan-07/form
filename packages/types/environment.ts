import { z } from "zod";

export const ZId = z.string().cuid2();

export const ZEnvironment = z.object({
    id: z.string().cuid2(),
    createdAt: z.date(),
    updatedAt: z.date(),
    productId: z.string(),
});

export type TEnvironment = z.infer<typeof ZEnvironment>;
