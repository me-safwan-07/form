import { createId } from "@paralleldrive/cuid2";

import {
  MessageSquareTextIcon,
  Rows3Icon,
} from "lucide-react";

import {
  TFormQuestionTypeEnum as QuestionId,
  TFormMultipleChoiceQuestion,
  TFormOpenTextQuestion,
} from "@/packages/types/forms";
import { replaceQuestionPresetPlaceholders } from "@/packages/ui/TemplateList/lib/utils";

export type TQuestion = {
  id: string;
  label: string;
  description: string;
  icon: any;
  preset: any;
};

export const questionTypes: TQuestion[] = [
  {
    id: QuestionId.OpenText,
    label: "Free text",
    description: "Ask for a text-based answer",
    icon: MessageSquareTextIcon,
    preset: {
      headline: { default: "Who let the dogs out?" },
      subheader: { default: "Who? Who? Who?" },
      placeholder: { default: "Type your answer here..." },
      longAnswer: true,
      inputType: "text",
    } as Partial<TFormOpenTextQuestion>,
  },
  {
    id: QuestionId.MultipleChoiceSingle,
    label: "Single-Select",
    description: "A single choice from a list of options (radio buttons)",
    icon: Rows3Icon,
    preset: {
      headline: { default: "What do you do?" },
      subheader: { default: "Can't do both." },
      choices: [
        { id: createId(), label: { default: "Eat the cake 🍰" } },
        { id: createId(), label: { default: "Have the cake 🎂" } },
      ],
      shuffleOption: "none",
    } as Partial<TFormMultipleChoiceQuestion>,
  },
];

export const universalQuestionPresets = {
  required: true,
};

export const getQuestionDefaults = (id: string, product: any) => {
  const questionType = questionTypes.find((questionType) => questionType.id === id);
  return replaceQuestionPresetPlaceholders(questionType?.preset, product);
};