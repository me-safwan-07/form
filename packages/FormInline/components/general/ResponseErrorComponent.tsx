import { processResponseData } from "@/packages/lib/responses";
import { TFormQuestion } from "@/packages/types/forms"
import { TResponseData } from "@/packages/types/responses";
import { SubmitButton } from "../buttons/SubmitButton";

type ResponseErrorComponentProps = {
    questions: TFormQuestion[];
    responseData: TResponseData;
    onRetry: () => void;
};

export const ResponseErrorComponent = ({ questions, responseData, onRetry }: ResponseErrorComponentProps) => {
    return (
        <div className="flex flex-col bg-white p-4">
            <span className="mb-1.5 text-base font-bold leading-6 text-slate-900">
                {"Your form is stuck :("}
            </span>
            <p className="max-w-md text-sm font-normal leading-6 text-slate-600">
                The servers cannot be reached at the moment.
                <br />
                Please retry now or try again later.
            </p>
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-100 px-4 py-5">
                <div className="flex max-h-36 flex-1 flex-col space-y-3 overflow-y-scroll">
                    {questions.map((questions, index) => {
                        const response = responseData[questions.id];
                        if (!response) return;
                        return (
                            <div key={questions.id} className="flex flex-col">
                                <span className="text-sm leading-6 text-slate-900">{`Question ${index + 1}`}</span>
                                <span className="mt-1 text-sm font-semibold leading-6 text-slate-900">
                                    {processResponseData(response)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="mt-4 flex flex-1 flex-row items-center justify-end space-x-2">
                <SubmitButton tabIndex={2} buttonLabel="Retry" isLastQuestion={false} onClick={() => onRetry()} />
            </div>
        </div>
    )
}