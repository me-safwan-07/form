import { TForm } from "@/packages/types/forms";

export const calculateElementIdx = (form: TForm, currentQuestionIdx: number): number => {
    // const currentQuestion = form.questions[currentQuestionIdx];
    const formLength = form.questions.length;
    const middleIdx = Math.floor(formLength / 2);
    
    const getLastQuestionIndex = () => {
        const lastQuestion = form.questions
            .sort((a, b) => form.questions.indexOf(a) - form.questions.indexOf(b))
            .pop();
        return form.questions.findIndex((e) => e.id === lastQuestion?.id)
    };

    let elementIdx = currentQuestionIdx || 0.5;
    const lastprevQuestionIdx = getLastQuestionIndex();

    if (lastprevQuestionIdx > 0) elementIdx = Math.min(middleIdx, lastprevQuestionIdx - 1);
    return elementIdx;
};