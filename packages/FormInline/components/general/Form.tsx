import { FormBaseProps } from "@/packages/types/playform";
import { useEffect, useMemo, useRef, useState } from "react";
import { WelcomeCard } from "./WelcomeCard";
import { cn } from "@/packages/lib/cn";
import { StackedCardsContainer } from "../wrappers/StackedCardsContainer";
import { TResponseData } from "@/packages/types/responses";
import { ThankYouCard } from "./ThankYouCard";
import { PlayformBranding } from "./PlayFormBranding";
import { ProgressBar } from "./ProgressBar";

export const Form = ({
    form,
    styling,
    
}: FormBaseProps) => {
    const [questionId, setQuestionId] = useState(() => {
        if (form.welcomeCard.enabled) {
            return "start";
        } else {
            return form?.questions[0]?.id;
        }
    });
    const [showError, setShowError] = useState(false);
    const [loadingElement, setLoadingElement] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    const [responseData, setResponseData] = useState<TResponseData>({});
    const cardArrangement = styling.cardArrangement?.linkSurveys ?? "straight";
    
    const currentQuestionIndex = form.questions.findIndex((q) => q.id === questionId);
    const currentQuestion = useMemo(() => {
        if (questionId === "end" && !form.thankYouCard.enabled) {
            const newHistory = [...history];
            const prevQuestionId = newHistory.pop();
            return form.questions.find((q) => q.id === prevQuestionId);
        } else {
            return form.questions.find((q) => q.id === questionId);
        }
    }, [questionId, form, history]);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const showProgressBar = !styling.hideProgressBar;

    useEffect(() => {
        // scroll to top when question changes
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    }, [questionId]);

    let currIdxTemp = currentQuestionIndex;
    let currQuesTemp = currentQuestion;

    const getNextQuestionId = (data: TResponseData): string => {
        const questions = form.questions;
        const responseValue = data[questionId];

        if (questionId === "start") return questions[0]?.id || "end";

        if (currIdxTemp === -1) throw new Error("Question not found");
        
        return questions[currIdxTemp + 1]?.id || "end";
    };

    const onChange = (responseDataUpdate: TResponseData) => {
        const updatedResponseData = { ...responseData, ...responseDataUpdate };
        setResponseData(updatedResponseData);
    };

    const onSubmit = (responseData: TResponseData) => {
        const questionId = Object.keys(responseData)[0];
        setLoadingElement(true);
        const nextQuestionId = getNextQuestionId(responseData);
        // const finished = nextQuestionId === "end";
        onChange(responseData);
        // TODO: add onResponse functionlity
        setQuestionId(nextQuestionId);
        // add to history
        setHistory([...history, questionId]);
        setLoadingElement(false);
    };

    const getCardContent = (questionIdx: number, offset: number): JSX.Element | undefined => {
        const content = () => {
            if (questionIdx === -1) {
                return (
                    <WelcomeCard 
                        key="start"
                        headline={form.welcomeCard.headline}
                        html={form.welcomeCard.html}
                        fileUrl={form.welcomeCard.fileUrl}
                        onSubmit={onSubmit}
                        form={form}
                        isCurrent={offset === 0}
                    />
                );
            } else if (questionIdx === form.questions.length) {
                return (
                    <ThankYouCard 
                        key="end"
                        isCurrent={offset === 0}
                        buttonLink={form.thankYouCard.buttonLink}
                    />
                )
            }
        };

        return (
            <div 
                className={cn(
                    "no-scrollbar md:rounded-custom rounded-t-custom bg-form-bg flex h-full w-full flex-col justify-between overflow-hidden transition-all duration-1000 ease-in-out",
                    cardArrangement === "simple" ? "form-shadow" : "",
                    offset === 0 || cardArrangement === "simple" ? "opacity-100" : "opacity-0"
                )}>
                <div 
                    ref={contentRef}
                    className={cn(
                        loadingElement ? "animate-pulse opacity-60" : "",
                        // TODO: fullSizeCards
                        // "my-auto"
                    )}>
                    {content()}
                </div>
                <div className="mx-6 mb-10 mt-2 space-y-3 md:mb-6 md:mt-6">
                    <PlayformBranding />
                    <ProgressBar form={form} questionId={questionId} />
                </div>
            </div>
        );
    };

    return (
        <>
            <StackedCardsContainer 
                cardArrangement={cardArrangement}
                currentQuestionId={questionId}
                getCardContent={getCardContent}
                form={form}
                styling={styling}
                setQuestionId={setQuestionId}
            />
        </>
    )
}