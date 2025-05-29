'use client';

import { TForm, TFormQuestion, TI18nString } from "@/packages/types/forms";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { Label } from "../Label";
import { Input } from "../Input";
import { getCardText, getChoiceLabel, getIndex, getPlaceHolderById } from "./utils";
import { structuredClone } from "@/packages/lib/pollyfills/structuredClone";
import { ImagePlusIcon, TrashIcon } from "lucide-react";
import { useSyncScroll } from "@/packages/lib/utils/hooks/useSyncScroll";

interface QuestionFormInputProps {
    id: string;
    value: TI18nString | string;
    localForm: TForm;
    questionIdx: number;
    updateQuestion?: (questionIdx: number, data:Partial<TFormQuestion>) => void;
    updateForm?: (data: Partial<TFormQuestion>) => void;
    // updateChoice?: (choiceIdx: number, data: Partial<TForm) // TODO add the TFormChoice type after that uncomment this line
    label: string,
    maxLength?: number;
    placeholder?: string;
    ref?: RefObject<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    className?:string;
}

export const QuestionFormInput = ({
    id,
    value,
    label,
    localForm,
    questionIdx,
    placeholder,
    onBlur,
    maxLength,
    updateQuestion,
    className,
    updateForm,
}: QuestionFormInputProps) => {
    const question: TFormQuestion = localForm.questions[questionIdx];
    const isChoice = id.includes("choice");
    const isMatrixLabelRow = id.includes("row");
    const isMatrixLabelColumn = id.includes('column');
    const isThankYouCard = questionIdx === localForm.questions.length
    const isWelcomeCard = questionIdx === -1; 
    const index = getIndex(id, isChoice || isMatrixLabelColumn || isMatrixLabelColumn);

    const questionId = useMemo(() => {
        return isWelcomeCard ? "start" : isThankYouCard ? "end" : "question.id";
    }, [isThankYouCard, isWelcomeCard]);


    const getElementTextBasedOnType = (): TI18nString => {
        if (isChoice && typeof index === "number") {
            return getChoiceLabel(question, index);
        }

        if (isThankYouCard || isWelcomeCard) {
            return getCardText(localForm, id, isThankYouCard)
        }

        // if ((isMatrixLabelColumn || isMatrixLabelRow) && typeof index == 'number') {
        //     return 
        // }

        return (
            (question && (question[id as keyof TFormQuestion] as  TI18nString)) || ""
        );
    };


    const [text, setText] = useState(getElementTextBasedOnType());
    const [renderedText, setRenderedText] = useState<JSX.Element[]>();

    const highlightContainerRef = useRef<HTMLInputElement>({} as HTMLInputElement);
    const inputRef = useRef<HTMLInputElement>({} as HTMLInputElement);

    // Hook to synchronize the horizontal scroll position of highlightContainerRef and inputRef.
    useSyncScroll(highlightContainerRef, inputRef);

    useEffect(() => {
        setText(getElementTextBasedOnType());
    }, [localForm]);

    const handleValue = (text: TI18nString) => {
        const headline = structuredClone(text);
        
        return headline['default'];
    };

    const createUpdatedText = (updatedText: string): TI18nString => {
        // working fine
        return {
            ...getElementTextBasedOnType(),
            ["default"]: updatedText,
        };
    };

    

    const handleUpdate = (updatedText: string) => {
        const text = createUpdatedText(updatedText) // true
        if (isThankYouCard || isWelcomeCard) {
            updateFormDetails(text)
        } else {
            updateQuestionDetails(text);
        }
    };

    const updateFormDetails = (text: TI18nString) => {
        if (updateForm) {
            updateForm({ [id]: text });
        }
    }

    const updateQuestionDetails = (text: TI18nString) => {
        if (updateQuestion) {
            updateQuestion(questionIdx, { [id]: text });
        }
    };
    // console.log("handlevalue data",handleValue(value));

    return (
        <div className="w-full">
            <div className="w-full">
                <div className="mb-2 mt-3">
                    <Label htmlFor={id}>{label}</Label>
                </div>

                <div className="flex flex-col gap-4 bg-white">
                    <div className="flex items-center space-x-2">
                        <div className="group relative w-full">
                            <div className="h-10 w-full"></div>
                            <Input 
                                key={`${questionId}-${id}`}
                                dir="auto"
                                className={`absolute top-0 text-black caret-black ${className}`}
                                placeholder={placeholder ? placeholder : getPlaceHolderById(id)}
                                id={id}
                                name={id}
                                aria-label={label}
                                autoComplete={"on"}
                                value={text["default"]}
                                ref={inputRef}
                                onBlur={onBlur}
                                onChange={(e) => {
                                    const text = {
                                        ...getElementTextBasedOnType(),
                                        ["default"]: e.target.value,
                                    };
                                    setText(text);
                                    // console.log("textdata", text, " e", e.target.value);
                                    handleUpdate(e.target.value);
                                }} 
                                maxLength={maxLength}
                                // TODO add invalid attrubute in future
                            />
                        </div>
                        {id === 'headline' && !isWelcomeCard && (
                            <ImagePlusIcon 
                                aria-label="Toggle image uploader"
                                className="ml-2 h-4 w-4 cursor-pointer text-slate-400 hover:text-slate-500"
                                // onClick={} // TODO
                            />
                        )} 
                        {id === "subheader" && question && question.subheader !== undefined && (
                            <TrashIcon 
                                className="ml-2 h-4 w-4 cursor-pointer text-slate-400 hover:text-slate-500"
                                // onClick={} // TODO
                            />  
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
};

QuestionFormInput.display = "QuestionFormInput"