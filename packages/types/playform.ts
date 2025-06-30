import { TForm, TFormStyling } from "./forms";
import { TProductStyling } from "./product";
import { TResponseUpdate } from "./responses";

export interface FormBaseProps {
    form: TForm;
    styling: TFormStyling | TProductStyling;
    getSetIsError?: (getSetError: (value: boolean) => void) => void;
    getSetIsResponseSendingFinished?: (getSetIsResponseSendingFinished: (value: boolean) => void) => void;
    getSetQuestionId?: (getSetQuestionId: (value: string) => void) => void;
    onDisplay?: () => void;
    onResponse?: (response: TResponseUpdate) => void;
    onFinished?: () => void;
    onClose?: () => void;
    onRetry?: () => void;
    autoFocus?: boolean;
    shouldResetQuestionId?: boolean
};

export interface FormInlineProps extends FormBaseProps {
  containerId: string;
}