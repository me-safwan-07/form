import { z } from "zod";

export const ZDisplayUpdateInput = z.object({
  environmentId: z.string().cuid(),
  userId: z.string().optional(),
  responseId: z.string().cuid().optional(),
});

export type TDisplayUpdateInput = z.infer<typeof ZDisplayUpdateInput>;

export const ZDisplayCreateInput = z.object({
  environmentId: z.string().cuid(),
  formId: z.string().cuid(),
  userId: z.string().optional(),
  responseId: z.string().cuid().optional(),
});

export type TDisplayCreateInput = z.infer<typeof ZDisplayCreateInput>;

export const ZDisplay = z.object({
  id: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  personId: z.string().cuid().nullable(),
  formId: z.string().cuid(),
  responseId: z.string().cuid().nullable(),
  status: z.enum(["seen", "responded"]).nullable(),
});

export type TDisplay = z.infer<typeof ZDisplay>;