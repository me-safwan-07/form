import { customForm } from "@/packages/lib/templates";
import { TTemplate } from "@/packages/types/templates";
import { PlusCircleIcon } from "lucide-react"
import { Button } from "../../Button";
import { cn } from "@/packages/lib/cn";
import { TProduct } from "@/packages/types/product";
import { replacePresetPlaceholders } from "../lib/utils";

interface StartFromScratchTemplateProps {
  activeTemplate: TTemplate | null;
  setActiveTemplate: (template: TTemplate) => void;
  onTemplateClick: (template: TTemplate) => void;
  product: TProduct;
  createForm: (template: TTemplate) => void;
  loading: boolean;
} 

export const StartFromScratchTemplate = ({
    activeTemplate,
    setActiveTemplate,
    // onTemplateClick,
    product,
    createForm,
    loading,
}: StartFromScratchTemplateProps) => {
    return (
        <button
            type="button"
            onClick={() => {
                const newTemplate = replacePresetPlaceholders(customForm, product);
                // onTemplateClick(newTemplate);
                setActiveTemplate(newTemplate);
            }}
            className={cn(
                activeTemplate?.name === customForm.name
                ? "ring-brand border-transparent ring-2"
                : "hover:border-brand-dark border-dashed border-slate-300",
                "duration-120 group relative rounded-lg border-2 bg-transparent p-6 transition-colors duration-150"
            )}>
            <PlusCircleIcon className="text-brand-dark h-8 w-8 transition-all duration-150 group-hover:scale-110" />
            <h3 className="text-md mb-1 mt-3 text-left font-bold text-slate-700">{customForm.name}</h3>
            <p className="text-left text-xs text-slate-600">{customForm.description}</p>
            {activeTemplate?.name === customForm.name && (
                <div className="text-left">
                    <Button
                        variant="darkCTA"
                        className="mt-6 px-6 py-3"
                        disabled={activeTemplate === null}
                        loading={loading}
                        onClick={() => createForm(activeTemplate)}>
                        Create survey
                    </Button>
                </div>
            )}
        </button>
    )
};