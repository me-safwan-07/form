import { TForm, TFormMultipleChoiceQuestion, TFormQuestion, TI18nString } from "@/packages/types/forms";
import { TypeOf } from "zod";

export const getIndex = (id: string, isChoice: boolean) => {
    if (!isChoice) return null;

    const parts = id.split("-");
    if (parts.length > 1) {
        return parseInt(parts[1], 10);
    }
    return null;
}

export const getChoiceLabel = (
    question: TFormQuestion,
    choiceIdx: number,
): TI18nString => {
    const choiceQuestion = question as TFormMultipleChoiceQuestion;
    return choiceQuestion.choices[choiceIdx]?.label || "";
};

export const getCardText = (
    form: TForm,
    id: string,
    isThankYouCard: boolean,
): TI18nString => {
    const card = isThankYouCard ? form.thankYouCard : form.welcomeCard;
    console.log("getCarddata", card[id as keyof typeof card] as TI18nString )
    return (card[id as keyof typeof card] as TI18nString) || "";
};



export const getPlaceHolderById = (id: string) => {
  switch (id) {
    case "headline":
      return "Your question here. Recall information with @";
    case "subheader":
      return "Your description here. Recall information with @";
    default:
      return "";
  }
};