import { z } from "zod";
import { ZFormQuestions, ZFormThankYouCard, ZFormWelcomeCard } from "./forms";

export const ZTemplate = z.object({
    name: z.string(),
    description: z.string(),
    icon: z.any().optional(),
    preset: z.object({
        name: z.string(),
        welcomeCard: ZFormWelcomeCard,
        questions: ZFormQuestions,
        thankYouCard: ZFormThankYouCard,
        // hiddenFields: ZFormHiddenFields,
    }),
});

export type TTemplate = z.infer<typeof ZTemplate>;
