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
  organizationId: z.string(),
  styling: ZProductStyling,
  darkOverlay: z.boolean(),
  environments: z.array(ZEnvironment).optional(),
  logo: ZLogo.nullish(),
});

export type TProduct = z.infer<typeof ZProduct>;

export const ZProductLegacy = z.object({
  id: z.string().cuid2(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string().trim().min(1, { message: "Product name cannot be empty" }),
  organizationId: z.string(),
  styling: ZProductStyling,
  // clickOutsideClose: z.boolean(),
  darkOverlay: z.boolean(),
  environments: z.array(ZEnvironment),
  brandColor: ZColor.nullish(),
  highlightBorderColor: ZColor.nullish(),
  logo: ZLogo.nullish(),
});

export type TProductLegacy = z.infer<typeof ZProductLegacy>;


export const ZProductUpdateInput = z.object({
  name: z.string().trim().min(1, { message: "Product name cannot be empty" }).optional(),
  organizationId: z.string().optional(),
  highlightBorderColor: ZColor.nullish(),
  darkOverlay: z.boolean().optional(),
  environments: z.array(ZEnvironment).optional(),
  styling: ZProductStyling.optional(),
  logo: ZLogo.optional(),
});

export type TProductUpdateInput = z.infer<typeof ZProductUpdateInput>;


export const ZProductConfigChannel = z.enum(["link", "app", "website"]).nullable();
export type TProductConfigChannel = z.infer<typeof ZProductConfigChannel>;
