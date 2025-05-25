import { z } from "zod";
import { ZEnvironment } from "./environment";
import { ZBaseStyling } from "./styling";
import { ZColor } from "./common";

export const ZProductStyling = ZBaseStyling.extend({
  allowStyleOverwrite: z.boolean(),
});

export type TProductStyling = z.infer<typeof ZProductStyling>;


export const ZLogo = z.object({
  url: z.string().optional(),
  bgColor: z.string().optional(),
});

export type TLogo = z.infer<typeof ZLogo>;


export const ZProduct = z.object({
  id: z.string().cuid2(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string().trim().min(1, { message: "Product name cannot be empty" }),
  styling: ZProductStyling,
  darkOverlay: z.boolean(),
  environments: z.array(ZEnvironment),
  logo: ZLogo.nullish(),
});

export type TProduct = z.infer<typeof ZProduct>;

export const ZProductUpdateInput = z.object({
  name: z.string().trim().min(1, { message: "Product name cannot be empty" }).optional(),
  highlightBorderColor: ZColor.nullish(),
  darkOverlay: z.boolean().optional(),
  environments: z.array(ZEnvironment).optional(),
  styling: ZProductStyling.optional(),
  logo: ZLogo.optional(),
});

export type TProductUpdateInput = z.infer<typeof ZProductUpdateInput>;
