import { TForm, TFormOpenTextQuestion, TFormOpenTextQuestionInputType } from "@/packages/types/forms";
import { Button } from "@/packages/ui/Button";
import { Label } from "@/packages/ui/Label";
import { QuestionFormInput } from "@/packages/ui/QuestionFormInput";
import { OptionsSwitcher } from "@/packages/ui/QuestionTypeSelector";
import { HashIcon, LinkIcon, MailIcon, MessageSquareTextIcon, PhoneIcon, PlusIcon } from "lucide-react";

const questionTypes = [
  { value: "text", label: "Text", icon: <MessageSquareTextIcon className="h-4 w-4" /> },
  { value: "email", label: "Email", icon: <MailIcon className="h-4 w-4" /> },
  { value: "url", label: "URL", icon: <LinkIcon className="h-4 w-4" /> },
  { value: "number", label: "Number", icon: <HashIcon className="h-4 w-4" /> },
  { value: "phone", label: "Phone", icon: <PhoneIcon className="h-4 w-4" /> },
];

interface OpenQuestionFormProps {
    localForm: TForm;
    question: TFormOpenTextQuestion;
    questionIdx: number;
    updateQuestion: (questionIdx: number, updatedAttributes: any) => void;
    // lastQuestion: boolean;
}



export const OpenQuestionForm = ({
    question,
    questionIdx,
    updateQuestion,
    localForm,
}: OpenQuestionFormProps) => {
    const handleInputChange = (value: string) => {
        const inputType = value as TFormOpenTextQuestionInputType;
        const updatedAttributes = {
            inputType: inputType,
            placeholder: { default: getPlaceholderByInputType(inputType) },
            longAnswer: inputType === "text" ? question.longAnswer : false,
        };
        updateQuestion(questionIdx, updatedAttributes);
    };
    return(
        <form>
            <QuestionFormInput 
                id="headline"
                value={question.headline}
                localForm={localForm}
                questionIdx={questionIdx}
                updateQuestion={updateQuestion}
                label={"Question*"}
            />

            <div>
                {question.subheader !== undefined && (
                    <div className="inline-flex w-full items-center">
                        <div className="w-full">
                            <QuestionFormInput 
                                id="subheader"
                                value={question.subheader}
                                localForm={localForm}
                                questionIdx={questionIdx}
                                updateQuestion={updateQuestion}
                                label={"Description"}
                            />
                        </div>
                    </div>
                )}
                {question.subheader === undefined && (
                    <Button
                        size="sm"
                        variant="minimal"
                        className="mt-3"
                        type="button"
                        onClick={() => {
                            updateQuestion(questionIdx, {
                                subheader: " ",
                            });
                        }}>
                        <PlusIcon className="mr-1 h-4 w-4"/>
                        Add Description
                    </Button>
                )} 
            </div>

            <div className="mt-3">
                <Label htmlFor="questionType">Input Type</Label>
                <div className="">
                    <OptionsSwitcher 
                        options={questionTypes}
                        currentOption={question.inputType}
                        handleTypeChange={handleInputChange}
                    />
                </div>
            </div>
        </form>
    )
};

const getPlaceholderByInputType = (inputType: TFormOpenTextQuestionInputType) => {
  switch (inputType) {
    case "email":
      return "example@email.com";
    case "url":
      return "http://...";
    case "number":
      return "42";
    case "phone":
      return "+1 123 456 789";
    default:
      return "Type your answer here...";
  }
};
