import { TFormOpenTextQuestion } from "@/packages/types/forms";
import { TResponseData } from "@/packages/types/responses";
import { useCallback } from "react";
import { ScrollableContainer } from "../wrappers/ScrollableContainer";
import { Headline } from "../general/Headline";
import { Subheader } from "../general/Subheader";
import { SubmitButton } from "../buttons/SubmitButton";
import { BackButton } from "../buttons/BackButton";

interface OpenTextQuestionProps {
    question: TFormOpenTextQuestion;
    value: string;
    onChange: (responseData: TResponseData) => void;
    onSubmit?: (data: TResponseData) => void;
    onBack: () => void;
    isFirstQuestion: boolean;
    isLastQuestion: boolean;
    autoFocus?: boolean;
    currentQuestionId: string
};

export const OpenTextQuestion = ({
    question,
    value,
    onChange,
    onSubmit,
    onBack,
    isFirstQuestion,
    isLastQuestion,
    autoFocus = false,
}: OpenTextQuestionProps) => {
    const handleInputChange = (inputValue: string) => {
        onChange({ [question.id]: inputValue });
    }

    const handleInputResize = (event: { target: any }) => {
        const maxHeight = 160; // 8 lines of text
        const textarea = event.target;
        textarea.style.height = "auto"; // Reset height to auto to get the scrollHeight correctly
        const newHight = Math.min(textarea.scrollHeight, maxHeight);
        textarea.style.height = `${newHight}px`;
        textarea.style.overflow = newHight >= maxHeight ? "auto" : "hidden"; // Show scrollbar if height exceeds maxHeight
    };

    const openTextRef = useCallback(
        (currentElement: HTMLInputElement | HTMLTextAreaElement | null) => {
            if (question.id && currentElement) {
                currentElement.focus();
            }
        },
        [question.id]
    );

    return (
        <form
            key={question.id}
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit?.({ [question.id]: value }); 
            }}
            className="w-full">
            <ScrollableContainer>
                <div>
                    <Headline 
                        headline={question.headline["default"]}
                        questionId={question.id}
                        required={question.required}
                    />
                    <Subheader 
                        subheader={question.subheader?.["default"] || ""}
                        questionId={question.id}
                    />
                    <div className="mt-4">
                        {question.longAnswer === false ? (
                            <input 
                                ref={openTextRef}
                                tabIndex={1}
                                name={question.id}
                                id={question.id}
                                placeholder="Type your answer here..."
                                dir="auto"
                                step="any"
                                required={question.required}
                                value={value ? (value as string) : ""}
                                type={question.inputType}
                                onInput={(e) => handleInputChange(e.currentTarget.value)}
                                autoFocus={autoFocus}
                                className="border-form-border placeholder:text-placeholder text-subheading focus:border-brand bg-input-bg rounded-custom block w-full border p-2 shadow-sm foucs:outline-none focus:ring-0 sm:fb-text-sm"
                                pattern={question.inputType === "phone" ? "[0-9+ ]+" : ".*"}
                                title={question.inputType === "phone" ? "Enter a valid phone number" : "Enter your answer"}
                            />
                        ) : (
                            <textarea 
                                ref={openTextRef}
                                rows={3}
                                name={question.id}
                                tabIndex={1}
                                aria-label="textarea"
                                id={question.id}
                                placeholder={"Type your answer here..."}
                                dir="auto"
                                required={question.required}
                                value={value as string}
                                // type={question.inputType}
                                onInput={(e) => {
                                    handleInputChange(e.currentTarget.value);
                                    handleInputResize(e);
                                }}
                                autoFocus={autoFocus}
                                className="border-form-border placeholder:text-placeholder text-subheading focus:border-brand bg-input-bg rounded-custom block w-full border p-2 shadow-sm foucs:outline-none focus:ring-0 sm:fb-text-sm resize-none overflow-hidden"
                                title={question.inputType === "phone" ? "Enter a valid phone number" : "Enter your answer"}
                            />
                        )}
                    </div>
                </div>
            </ScrollableContainer>
            <div className="flex w-full justify-between px-6 py-4">
                {!isFirstQuestion && (
                    <BackButton 
                        onClick={() => onBack()}
                    />
                )}
                <div></div>
                <SubmitButton 
                    isLastQuestion={isLastQuestion}
                    onClick={() => {}}
                />
            </div>
        </form>
    )

};