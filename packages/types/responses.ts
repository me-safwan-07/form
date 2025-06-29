import { z } from "zod";
import { ZId } from "./environment";
import { finished } from "stream";

export const ZResponseDataValue = z.union([
  z.string(),
  z.number(),
  z.array(z.string()),
  z.record(z.string()),
]);

export type TResponseDataValue = z.infer<typeof ZResponseDataValue>;

export const ZResponseData = z.record(ZResponseDataValue);

export type TResponseData = z.infer<typeof ZResponseData>;

export const ZResponseHiddenFieldsFilter = z.record(z.array(z.string()));

export type TResponseHiddenFieldsFilter = z.infer<typeof ZResponseHiddenFieldsFilter>;

export const ZResponseHiddenFieldValue = z.record(z.union([z.string(), z.number(), z.array(z.string())]));
export type TResponseHiddenFieldValue = z.infer<typeof ZResponseHiddenFieldValue>;


export const ZResponseUpdate = z.object({
  finished: z.boolean(),
  data: ZResponseData,
  language: z.string().optional(),
//   ttc: ZResponseTtc.optional(),
  meta: z
    .object({
      url: z.string().optional(),
      source: z.string().optional(),
      action: z.string().optional(),
    })
    .optional(),
  hiddenFields: ZResponseHiddenFieldValue.optional(),
});

export type TResponseUpdate = z.infer<typeof ZResponseUpdate>;

export const ZResponsePerson = z.object({
  id: ZId,
  userId: z.string(),
});


export const ZResponse = z.object({
  id: z.string().cuid2(),
  createAt: z.date(),
  updatedAt: z.date(),
  formId: z.string().cuid2(),
  person: ZResponsePerson.nullable(),
  finished: z.boolean(),
  data: ZResponseData,
});

export type TResponse = z.infer<typeof ZResponse>;

export const ZResponseInput = z.object({
  createAt: z.coerce.date().optional(),
  updateAt: z.coerce.date().optional(),
  environmentId: z.string().cuid2(),
  formId: z.string().cuid2(),
  userId: z.string().nullish(),
  finished: z.boolean(),
  data: ZResponseData,
});

export type TResponseInput = z.infer<typeof ZResponseInput>;

export const ZResponseUpdateInput = z.object({
  finished: z.boolean(),
  data: ZResponseData,
});

export type TResponseUpdateInput = z.infer<typeof ZResponseUpdateInput>;


