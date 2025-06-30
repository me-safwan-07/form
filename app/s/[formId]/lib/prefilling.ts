// import { TForm } from "@/packages/types/forms";
// import { TResponseData } from "@/packages/types/responses";

// export const getPrefillvalue = (
//     form: TForm,
//     searchParams: URLSearchParams,
// ): TResponseData | undefined => {
//     const prefillAnswer: TResponseData = {};
//     let questionIdxMap: { [key: string]: number } = {};

//     form.questions.forEach((q, idx) => {
//         questionIdxMap[q.id] = idx;
//     });

//     searchParams.forEach((value, key) => {
//         const questiondId = key;
//         const questionIdx = questionIdxMap[questiondId];
//         const question = form.questions[questionIdx];
//         const answer = value;
        
//         if (question && chekc)
//     })
// }