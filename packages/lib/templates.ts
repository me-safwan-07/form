import { TFormOpenTextQuestion, TFormQuestionTypeEnum, TFormThankYouCard, TFormWelcomeCard } from "../types/forms";
import { TTemplate } from "../types/templates";
import { createId } from "@paralleldrive/cuid2";

const thankYouCardDefault: TFormThankYouCard = {
  enabled: true,
  headline: { default: "Thank you!" },
  subheader: { default: "We appreciate your feedback." },
  buttonLabel: { default: "Create your own Survey" },
  buttonLink: "https://formbricks.com/signup",
};

const welcomeCardDefault: TFormWelcomeCard = {
  enabled: false,
  headline: { default: "Welcome!" },
  html: { default: "Thanks for providing your feedback - let's go!" },
  timeToFinish: false,
  showResponseCount: false,
};

const formDefault: TTemplate["preset"] = {
  name: "New Form",
  welcomeCard: welcomeCardDefault,
  thankYouCard: thankYouCardDefault,
  questions: [],
};

export const customForm = {
  name: "Start from scratch",
  description: "Create a survey without template.",
  preset: {
    ...formDefault,
    name: "New Form",
    questions: [
      {
        id: createId(),
        type: TFormQuestionTypeEnum.OpenText,
        headline: { default: "What would you like to know?" },
        subheader: { default: "This is an example survey." },
        placeholder: { default: "Type your answer here..." },
        required: true,
        inputType: "text",
      } as TFormOpenTextQuestion,
    ],
  },
};