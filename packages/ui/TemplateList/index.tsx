'use client';

import { useState } from "react";
import { StartFromScratchTemplate } from "./components/StartFromScratchTemplate";
import { TTemplate } from "@/packages/types/templates";
import { createFormAction } from "./actions";
import { TEnvironment } from "@/packages/types/environment";
import { TUser } from "@/packages/types/user";
import { useRouter } from "next/navigation";
import { TFormInput } from "@/packages/types/forms";

interface TemplateListProps {
    user: TUser;
    environment: TEnvironment;
    onTemplateClick?: (template: TTemplate) => void;

}

export const TemplateList = ({
    user,
    environment,
    onTemplateClick
}: TemplateListProps) => {
    const router = useRouter();
    const [activeTemplate, setActiveTemplate] = useState<TTemplate | null>(null);
    const [loading, setLoading] = useState(false);
    
    const createForm = async (activeTemplate: TTemplate) => {
        setLoading(true);
        const augumentedTemplate: TFormInput  ={
            ...activeTemplate,
            createdBy: user.id,
        };
        const form = await createFormAction(environment.id, augumentedTemplate);
        router.push(`/environment/${environment.id}/forms/${form.id}/edit`);
    }
    return (
        <main className="relative z-0 flex-1 overflow-y-auto px-6 pb-6 focus:outline-none">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StartFromScratchTemplate 
                    activeTemplate={activeTemplate}
                    setActiveTemplate={setActiveTemplate}
                    onTemplateClick={onTemplateClick}
                    createForm={createForm}
                    loading={loading}
                />  
            </div>
        </main>
    )
};