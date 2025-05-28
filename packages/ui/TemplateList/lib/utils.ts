import { structuredClone } from "@/packages/lib/pollyfills/structuredClone";
import { TFormQuestion } from "@/packages/types/forms";
import { TProduct } from "@/packages/types/product";
import { TTemplate } from "@/packages/types/templates";

export const replaceQuestionPresetPlaceholders = (
  question: TFormQuestion,
  product: TProduct
): TFormQuestion => {
  if (!product) return question;

  const newQuestion = structuredClone(question);
  const defaultCode = "default";

  if (newQuestion.headline) {
    newQuestion.headline[defaultCode] = newQuestion.headline[defaultCode].replace("{{ProductName}}", product.name);
  }

  if (newQuestion.subheader) {
    newQuestion.subheader[defaultCode] = newQuestion.subheader[defaultCode].replace("{{productName}}", product.name);
  }

  return newQuestion;
};


// replace all occurences of productName with the actual product name in the current template
export const replacePresetPlaceholders = (template: TTemplate, product: any) => {
    const preset = structuredClone(template.preset);
    preset.name = preset.name.replace("{{productName}}", product.name);
    preset.questions = preset.questions.map((question) => {
        return replaceQuestionPresetPlaceholders(question, product);
    });
    return { ...template, preset };
};

