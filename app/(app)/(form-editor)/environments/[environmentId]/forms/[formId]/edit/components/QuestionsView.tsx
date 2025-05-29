import { TForm } from "@/packages/types/forms"
import { TProduct } from "@/packages/types/product";
import { SetStateAction } from "react";
import { EditWelcomeCard } from "./EditWelcomeCard";
import { AddQuestionButton } from "./AddQuestionButton";

interface QuestionsViewProps {
    localForm: TForm;
    setLocalForm: React.Dispatch<SetStateAction<TForm>>;
    activeQuestionId: string | null;
    setActiveQuestionId: (questionId: string | null) => void;
    product: TProduct;
}

export const QuestionsView = ({
    localForm,
    setLocalForm,
    activeQuestionId,
    setActiveQuestionId,
    product
}: QuestionsViewProps) => {

    const addQuestion = (question: any, index?: number) => {
        const updatedForm = { ...localForm };
        
    }
    return (
        <div className="mt-16 w-full px-5 py-4">
            <div className="mb-5 flex w-full flex-col gap-5">
                <EditWelcomeCard 
                    localForm={localForm}
                    setLocalForm={setLocalForm}
                    setActiveQuestionId={setActiveQuestionId}
                    activeQuestionId={activeQuestionId}
                />
            </div>

            {/* TODO and the  Question components*/}
            
            {/* <AddQuestionButton addQuestion={} product={product} /> */}
        </div>
    )
}