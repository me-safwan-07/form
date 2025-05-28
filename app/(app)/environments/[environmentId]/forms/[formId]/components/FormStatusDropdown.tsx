import { TEnvironment } from "@/packages/types/environment";
import { TForm } from "@/packages/types/forms"

interface FormStatusDropdownProps {
    form: TForm;
    environment?: TEnvironment;
}

export const FormStatusDropdown = ({
    form,
}: FormStatusDropdownProps) => {
    return (
        <>
            {form.status === "draft" && (
                <div className="flex items-center">
                    <p className="text-sm italic text-slate-600">Draft</p>
                </div>
            )}
        </>
    )
}