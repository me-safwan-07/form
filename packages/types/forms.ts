import { z } from "zod";

export const ZI18nString = z.record(z.string()).refine((obj) => "default" in obj, {
  message: "Object must have a 'default' key",
});

export type TI18nString = z.infer<typeof ZI18nString>;

export const ZFormThankYouCard = z.object({
  enabled: z.boolean(),
  headline: ZI18nString.optional(),
  subheader: ZI18nString.optional(),
  buttonLabel: ZI18nString.optional(),
  buttonLink: z.optional(z.string()),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
});

export type TFormThankYouCard = z.infer<typeof ZFormThankYouCard>;

export enum TFormQuestionTypeEnum {
  FileUpload = "fileUpload",
  OpenText = "openText",
  MultipleChoiceSingle = "multipleChoiceSingle",
  MultipleChoiceMulti = "multipleChoiceMulti",
  NPS = "nps",
  CTA = "cta",
  Rating = "rating",
  Consent = "consent",
  PictureSelection = "pictureSelection",
  Cal = "cal",
  Date = "date",
  Matrix = "matrix",
  Address = "address",
}

export const ZFormQuestionBase = z.object({
  id: z.string(),
  type: z.string(),
  headline: ZI18nString,
  subheader: ZI18nString.optional(),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  required: z.boolean(),
  buttonLabel: ZI18nString.optional(),
  backButtonLabel: ZI18nString.optional(),
  scale: z.enum(["number", "smiley", "star"]).optional(),
  range: z.union([z.literal(5), z.literal(3), z.literal(4), z.literal(7), z.literal(10)]).optional(),
  isDraft: z.boolean().optional(),
});


export const ZFormWelcomeCard = z
    .object({
        enabled: z.boolean(),
        headline: ZI18nString.optional(),
        html: ZI18nString.optional(),
        fileUrl: z.string().optional(),
        buttonLabel: ZI18nString.optional(),
        timeToFinish: z.boolean().default(true),
        showResponseCount: z.boolean().default(false),
        videoUrl: z.string().optional(),
    })
    .refine((schema) => !(schema.enabled && !schema.headline), {
        message: "Welcome card must have a headline",
    });

export type TFormWelcomeCard = z.infer<typeof ZFormWelcomeCard>;

export const ZFormOpenTextQuestionInputType = z.enum(["text", "email", "url", "number", "phone"]);

export const ZFormOpenTextQuestion = ZFormQuestionBase.extend({
  type: z.literal(TFormQuestionTypeEnum.OpenText),
  placeholder: ZI18nString.optional(),
  longAnswer: z.boolean().optional(),
  inputType: ZFormOpenTextQuestionInputType.optional().default("text"),
});

export type TFormOpenTextQuestion = z.infer<typeof ZFormOpenTextQuestion>;

export const ZFormChoice = z.object({
  id: z.string(),
  label: ZI18nString,
});

export const ZShuffleOption = z.enum(["none", "all", "exceptLast"]);


export const ZFormMultipleChoiceQuestion = ZFormQuestionBase.extend({
  type: z.union([
    z.literal(TFormQuestionTypeEnum.MultipleChoiceSingle),
    z.literal(TFormQuestionTypeEnum.MultipleChoiceMulti),
  ]),
  choices: z.array(ZFormChoice),
  shuffleOption: ZShuffleOption.optional(),
  otherOptionPlaceholder: ZI18nString.optional(),
})

export type TFormMultipleChoiceQuestion = z.infer<typeof ZFormMultipleChoiceQuestion>;


export const ZFormQuestion = z.union([
  ZFormOpenTextQuestion,
//   ZFormConsentQuestion,
  ZFormMultipleChoiceQuestion,
//   ZFormNPSQuestion,
//   ZFormCTAQuestion,
//   ZFormRatingQuestion,
//   ZFormPictureSelectionQuestion,
//   ZFormDateQuestion,
//   ZFormFileUploadQuestion,
//   ZFormCalQuestion,
//   ZFormMatrixQuestion,
//   ZFormAddressQuestion,
]);

export type TFormQuestion = z.infer<typeof ZFormQuestion>;

export const ZFormQuestions = z.array(ZFormQuestion);

export const ZFormStatus = z.enum(["draft", "scheduled", "inProgress", "paused", "completed"]);

export const ZFormInput = z.object({
  name: z.string(),
  createdBy: z.string().cuid().nullish(),
  status: ZFormStatus.optional(),
//   displayOption: ZFormDisplayOption.optional(),
  autoClose: z.number().nullish(),
  redirectUrl: z.string().url().nullish(),
  recontactDays: z.number().nullish(),
  welcomeCard: ZFormWelcomeCard.optional(),
  questions: ZFormQuestions.optional(),
  thankYouCard: ZFormThankYouCard.optional(),
//   delay: z.number().optional(),
//   autoComplete: z.number().nullish(),
//   runOnDate: z.date().nullish(),
//   closeOnDate: z.date().nullish(),
//   styling: ZFormStyling.optional(),
//   surveyClosedMessage: ZFormClosedMessage.nullish(),
//   singleUse: ZFormSingleUse.nullish(),
//   verifyEmail: ZFormVerifyEmail.optional(),
//   pin: z.string().nullish(),
//   resultShareKey: z.string().nullish(),
//   displayPercentage: z.number().min(0.01).max(100).nullish(),
//   triggers: z.array(z.object({ actionClass: ZActionClass })).optional(),
});

export type TFormInput = z.infer<typeof ZFormInput>;

export const ZForm = z.object({
  id: z.string().cuid2(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  environmentId: z.string(),
  createdBy: z.string().nullable(),
  status: ZFormStatus,
//   autoClose: z.number().nullable(),
  redirectUrl: z.string().url().nullable(),
//   recontactDays: z.number().nullable(),
//   displayLimit: z.number().nullable(),
  welcomeCard: ZFormWelcomeCard,
  questions: ZFormQuestions,
  thankYouCard: ZFormThankYouCard,
//   delay: z.number(),
//   autoComplete: z.number().nullable(),
//   runOnDate: z.date().nullable(),
//   closeOnDate: z.date().nullable(),
//   productOverwrites: ZSurveyProductOverwrites.nullable(),
//   styling: ZSurveyStyling.nullable(),
//   surveyClosedMessage: ZSurveyClosedMessage.nullable(),
//   segment: ZSegment.nullable(),
//   singleUse: ZSurveySingleUse.nullable(),
//   verifyEmail: ZSurveyVerifyEmail.nullable(),
//   pin: z.string().nullish(),
//   resultShareKey: z.string().nullable(),
//   displayPercentage: z.number().min(0.01).max(100).nullable(),
//   languages: z.array(ZSurveyLanguage),
//   showLanguageSwitch: z.boolean().nullable(),
});

export type TForm = z.infer<typeof ZForm>;


export type TFormEditorTabs = "questions" | "settings" | "styling";

export const ZFormFilterCriteria = z.object({
  name: z.string().optional(),
  status: z.array(ZFormStatus).optional(),
  // // type: z.array(ZFormType).optional(),
  // createdBy: z
  //   .object({
  //     userId: z.string(),
  //     value: z.array(z.enum(["you", "others"])),
  //   })
  //   .optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "name"]).optional(),
});

export type TFormFilterCriteria = z.infer<typeof ZFormFilterCriteria>;
