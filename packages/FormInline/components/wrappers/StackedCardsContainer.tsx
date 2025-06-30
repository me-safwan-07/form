'use client';

// offset = 0 -> Current question card
// offset < 0 -> Question cards that are already answered
// offset > 0 -> Question that aren't answered yet

import { cn } from "@/packages/lib/cn";
import { TForm, TFormStyling } from "@/packages/types/forms";
import { TProductStyling } from "@/packages/types/product";
import { TCardArrangementOptions } from "@/packages/types/styling"
import { useEffect, useMemo, useRef, useState } from "react";

interface StackedCardsContainerProps {
    cardArrangement: TCardArrangementOptions;
    currentQuestionId: string;
    form: TForm;
    getCardContent: (questionIdxTemp: number, offset: number) => JSX.Element | undefined;
    styling: TProductStyling | TFormStyling;
    setQuestionId: (questionId: string) => void;
    shouldResetQuestionId?: boolean;
}

export const StackedCardsContainer = ({
    cardArrangement,
    currentQuestionId,
    form,
    getCardContent,
    styling,
    setQuestionId,
    shouldResetQuestionId = true,
}: StackedCardsContainerProps) => {
    const [hovered, setHovered] = useState(false);
    const highlightBorderColor = 
        form.styling?.highlightBorderColor?.light || styling.highlightBorderColor?.light;
    const cardBorderColor = form.styling?.cardBorderColor?.light || styling.cardBorderColor?.light;
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const resizeObserver = useRef<ResizeObserver | null>(null);
    const [cardHeight, setCardHeight] = useState("auto");
    const [cardWidth, setCardWidth] = useState<number>(0);

    const questionIdxTemp = useMemo(() => {
        if (currentQuestionId === "start") return form.welcomeCard.enabled ? -1 : 0;
        if (currentQuestionId === "end") return form.thankYouCard.enabled ? form.questions.length : 0;
        return form.questions.findIndex((question) => question.id === currentQuestionId);
    }, [currentQuestionId, form.welcomeCard.enabled, form.thankYouCard.enabled, form.questions]);

    const [prevQuestionIdx, setPrevQuestionIdx] = useState(questionIdxTemp - 1);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(questionIdxTemp);
    const [nextQuestionIdx, setNextQuestionIdx] = useState(questionIdxTemp + 1);
    const [visitedQuestions, setVisitedQuestions] = useState<number[]>([]);

    const borderStyles = useMemo(() => {
      const baseStyle = {
          border: "1px solid",
          borderRadius: "var(--form-border-radius)",
      };
      // Determine borderColor based on the form type and availability of  highlightBorderColor
      const borderColor = !highlightBorderColor ? cardBorderColor : highlightBorderColor;
      return {
          ...baseStyle,
          borderColor: borderColor,
      }
    }, [cardBorderColor, highlightBorderColor]);

    const calculateCardTransform = useMemo(() => {
        const rotationCoefficient = cardWidth >= 1000 ? 1.5 : cardWidth > 650 ? 2 : 3;
        return (offset: number) => {
            switch (cardArrangement) {
                case "casual":
                    return offset < 0
                        ? `translateX(33%)`
                        : `translateX(0) rotate(-${(hovered ? rotationCoefficient : rotationCoefficient - 0.5) * offset}deg)`;
                case "straight":
                    return offset < 0 ? `translateY(25%)` : `translateY(-${(hovered ? 12 : 10) * offset}px)`;
                default:
                    return offset < 0 ? `translateX(0)` : `translateX(0)`;
            }
        };
    }, [cardArrangement, hovered, cardWidth]);

    const straightCardArrangementStyles = (offset: number) => {
        if (cardArrangement === "straight") {
            // styles to set the descending width of stacked question cards when card arrangement is set to straight
            return {
                width: `${100 - 5 * offset >= 100 ? 100 : -5 * offset}%`,
                margin: "auto",
            };
        }
    };

    // UseEffect to handle the resize of current question card and set cardHeight accodingly
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentElement = cardRefs.current[questionIdxTemp];
            if (currentElement) {
                if (resizeObserver.current) {
                    resizeObserver.current.disconnect();
                }
                resizeObserver.current = new ResizeObserver((entries) => {
                    for (const entry of entries) {
                        setCardHeight(entry.contentRect.height + "px");
                        setCardWidth(entry.contentRect.width);
                    }
                });
                resizeObserver.current.observe(currentElement);
            }
        }, 0);
        return () => {
            resizeObserver.current?.disconnect();
            clearTimeout(timer);
        };
    }, [questionIdxTemp, cardArrangement, cardRefs]);

    // Reset question progress, when card arrangement changes
    useEffect(() => {
        if (shouldResetQuestionId) {
            setQuestionId(form.welcomeCard.enabled ? "start" : form?.questions[0]?.id);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardArrangement]);
    
    const getCardHeight = (offset: number): string => {
        // Take default height depending upon card content
        if (offset === 0) return "auto";
        // Preserve orginal height
        else if (offset < 0) return "initial";
        // Assign the height of the foremost card to all cards behind it
        else return cardHeight;
    }

    return (
        <div 
            className="relative flex h-full items-end justify-center md:items-center"
            onMouseEnter={() => {
                setHovered(true);
            }}
            onMouseLeave={() => setHovered(false)}>
            <div style={{ height: cardHeight}}></div>
            {cardArrangement === "simple" ? (
                <div 
                    // TODO add the fullSizeCards
                    className={cn("w-full")}
                    style={{
                        ...borderStyles,
                    }}>
                    {getCardContent(questionIdxTemp, 0)}
                </div>
            ) : (
                questionIdxTemp !== undefined &&
                [prevQuestionIdx, currentQuestionIdx, nextQuestionIdx, nextQuestionIdx + 1].map(
                    (questionIdxTemp, index) => {
                        // check for hiding extra card
                        if (form.thankYouCard.enabled) {
                            if (questionIdxTemp > form.questions.length) return;
                        } else {
                            if (questionIdxTemp > form.questions.length - 1) return;
                        }
                        const offset = index - 1;
                        const isHidden = offset < 0;

                        return (
                            
                            <div 
                                ref={(el) => (cardRefs.current[questionIdxTemp] = el)}
                                id={`questionCard-${questionIdxTemp}`}
                                key={questionIdxTemp}
                                style={{
                                    zIndex: 1000 - questionIdxTemp,
                                    transform: `${calculateCardTransform(offset)}`,
                                    opacity: isHidden ? 0 : (100 - 0 * offset) / 100,
                                    height: getCardHeight(offset), // TODO: getCardHeigth here if fullSizeCards is false
                                    transitionDuration: "600ms",
                                    pointerEvents: offset === 0 ? "auto" : "none",
                                    ...borderStyles,
                                    ...straightCardArrangementStyles(offset),
                                }}
                                className="pointer rounded-custom bg-form-bg absolute inset-x-0 backdrop-blur-md transition-all ease-in-out">
                                {getCardContent(questionIdxTemp, offset)}
                            </div>
                        );
                    }
                )
            )}
        </div>
    )
}