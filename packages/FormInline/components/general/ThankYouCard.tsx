import { useEffect } from "react";
import { ScrollableContainer } from "../wrappers/ScrollableContainer"
import { Headline } from "./Headline";
import { SubmitButton } from "../buttons/SubmitButton";
import { Subheader } from "./Subheader";

interface ThankYouCardProps {
    buttonLink?: string;
    isCurrent?: boolean;
}
export const ThankYouCard = ({
    buttonLink,
    isCurrent
}: ThankYouCardProps) => {
    const checkmark = (
        <div className="text-brand flex flex-col items-center justify-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                class="h-24 w-24">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <span className="bg-brand mb-[10px] inline-block h-1 w-16 rounded-[100%]"></span>
        </div>
    );

    const handleSubmit = () => {
        if (buttonLink) window.location.replace(buttonLink);
    };

    useEffect(() => {
        const handleEnter = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                handleSubmit();
            }
        };

        if (isCurrent) {
            document.addEventListener("keydown", handleEnter);
        } else {
            document.removeEventListener("keydown", handleEnter);
        }

        return () => {
            document.removeEventListener("keydown", handleEnter);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCurrent]);

    return (
        <ScrollableContainer>
            <div className="text-center">
                {checkmark}
                <Headline alignTextCenter={true} headline="Thank you!" questionId="thankYouCard" />
                <Subheader subheader="thank you for you responses" questionId="thankYouCard" />
                <div className="mt-6 flex w-full flex-col items-center justify-center space-y-4">
                    <SubmitButton
                        type="button"
                        isLastQuestion={false}
                        focus={true}
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </ScrollableContainer>
    )
}