import { TForm, TI18nString } from "@/packages/types/forms"
import { ScrollableContainer } from "../wrappers/ScrollableContainer"
import Image from "next/image";
import { Headline } from "./Headline";
import { HtmlBody } from "./HtmlBody";
import { SubmitButton } from "../buttons/SubmitButton";
import { TResponseData } from "@/packages/types/responses";
import { useEffect } from "react";

interface WelcomeCardProps {
    headline?: TI18nString;
    html?: TI18nString;
    onSubmit: (data: TResponseData) => void;
    fileUrl?: string;
    form: TForm;
    isCurrent: boolean;
}

export const WelcomeCard = ({
    headline,
    html,
    fileUrl,
    onSubmit,
    form,
    isCurrent,
}: WelcomeCardProps) => {
    const handleSubmit = () => {
        onSubmit({ ["welcomeCard"]: "clicked" });
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
        <div>
            <ScrollableContainer>
                <div>
                    {fileUrl && (
                        <Image 
                            src={fileUrl}
                            className="mb-8 max-h-96 w-1/3 rounded-lg object-contain"
                            alt="Company Logo"
                        />
                    )}

                    <Headline 
                        headline={headline?.["default"]}
                        questionId="welcomeCard"
                    />

                    <HtmlBody 
                        htmlString={html?.default}
                        questionId="welcomeCard"
                    />
                </div>
            </ScrollableContainer>

            <div className="mx-6 mt-4 flex gap-4 py-4">
                <SubmitButton
                    isLastQuestion={false}
                    focus={true}
                    onClick={handleSubmit}
                    type="button"
                    onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                />
            </div>
        </div>
    )
}