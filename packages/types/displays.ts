export const ZDisplayUpdateInput = z.object({
  environmentId: z.string().cuid(),
  userId: z.string().optional(),
  responseId: z.string().cuid().optional(),
});

export type TDisplayUpdateInput = z.infer<typeof ZDisplayUpdateInput>;