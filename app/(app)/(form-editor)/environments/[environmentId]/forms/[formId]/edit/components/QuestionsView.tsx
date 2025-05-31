"use client";

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { TForm, TFormQuestion } from "@/packages/types/forms"
import { TProduct } from "@/packages/types/product";
import { SetStateAction, useMemo } from "react";
import { EditWelcomeCard } from "./EditWelcomeCard";
import { AddQuestionButton } from "./AddQuestionButton";
import { createId } from "@paralleldrive/cuid2";
import { EditThankYouCard } from "./EditThankYouCard";
import { QuestionDroppable } from "./QuestionsDroppable";
import { structuredClone } from "@/packages/lib/pollyfills/structuredClone";
import toast from "react-hot-toast";
import { duplicateForm } from "@/packages/lib/form/service";

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
    const internalQuestionIdMap = useMemo(() => {
        return localForm.questions.reduce((acc, question) => {
            acc[question.id] = createId();
            return acc;
        }, {});
    }, [localForm.questions]);

    const updateQuestion = (questionIdx: number, updatedAttributes: any) => {
        const updatedForm = { ...localForm };

        updatedForm.questions[questionIdx] = {
            ...updatedForm.questions[questionIdx],
            ...updatedAttributes,
        };

        setLocalForm(updatedForm)
    };

    const deleteQuestion = (questionIdx: number) => {
        const questionId = localForm.questions[questionIdx].id;
        const activeQuestionIdTemp = activeQuestionId ?? localForm.questions[0].id;
        const updatedForm: TForm = { ...localForm };

        updatedForm.questions.splice(questionIdx, 1);
        setLocalForm(updatedForm);
        delete internalQuestionIdMap[questionId];
        if (questionId === activeQuestionIdTemp) {
            if (questionIdx <= localForm.questions.length && localForm.questions.length > 0) {
                setActiveQuestionId(localForm.questions[questionIdx % localForm.questions.length].id);
            } else if (localForm.thankYouCard.enabled) {
                setActiveQuestionId("end");
            }
        }
        toast.success("Question deleted");
    };

    const duplicateQuestion = (questionIdx: number) => {
        const questionToDuplicate = structuredClone(localForm.questions[questionIdx]);

        const newQuestionId = createId();

        // create a copy of the question with a new Id
        const duplicatedQuestion = {
            ...questionToDuplicate,
            id: newQuestionId
        };

        // insert the new question right after the original on e
        const updatedForm = { ...localForm };
        updatedForm.questions.splice(questionIdx + 1, 0, duplicatedQuestion);

        setLocalForm(updatedForm);
        setActiveQuestionId(newQuestionId);
        internalQuestionIdMap[newQuestionId] = createId();

        toast.success("Question duplicated.");
    }

    const addQuestion = (question: any, index?: number) => {
        const updatedForm = { ...localForm };

        if (index) {
            updatedForm.questions.splice(index, 0, { ...question, isDraft: true });
        } else {
            updatedForm.questions.push({ ...question, isDraft: true });
        }
        
        setLocalForm(updatedForm);
        setActiveQuestionId(question.id);
        internalQuestionIdMap[question.id] = createId();
    };

    const moveQuestion = (questionIndex: number, up:boolean) => {
        const newQuestions = Array.from(localForm.questions);
        const [reorderedQuestion] = newQuestions.splice(questionIndex, 1);
        const destinationIndex = up ? questionIndex - 1 : questionIndex + 1;
        newQuestions.splice(destinationIndex, 0, reorderedQuestion);
        const updatedForm = { ...localForm, questions: newQuestions};
        setLocalForm(updatedForm);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const OnDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        const newQuestions = Array.from(localForm.questions);
        const sourceIndex = newQuestions.findIndex((question) => question.id === active.id);
        const destinationIndex = newQuestions.findIndex((question) => question.id === over?.id);
        const [reorderedQuestion] = newQuestions.splice(sourceIndex, 1);
        newQuestions.splice(destinationIndex, 0 , reorderedQuestion);
        const updatedForm = { ...localForm, question: newQuestions };
        setLocalForm(updatedForm);
    };

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

            <DndContext sensors={sensors} onDragEnd={OnDragEnd} collisionDetection={closestCorners}>
                <QuestionDroppable 
                    localForm={localForm}
                    product={product}
                    moveQuestion={moveQuestion}
                    updateQuestion={updateQuestion}
                    duplicateQuestion={duplicateQuestion}
                    deleteQuestion={deleteQuestion}
                    activeQuestionId={activeQuestionId}
                    setActiveQuestionId={setActiveQuestionId}
                    internalQuestionIdMap={internalQuestionIdMap}
                    addQuestion={addQuestion}
                />
            </DndContext>
            
            <AddQuestionButton addQuestion={addQuestion} product={product} />
            {/* <div className="mt-5 flex flex-col gap-5">
                <EditThankYouCard 
                    localForm={localForm}
                    setLocalForm={setLocalForm}
                    setActiveQuestionId={setActiveQuestionId}
                    activeQuestionId={activeQuestionId}
                />
            </div> */}
        </div>
    )
}