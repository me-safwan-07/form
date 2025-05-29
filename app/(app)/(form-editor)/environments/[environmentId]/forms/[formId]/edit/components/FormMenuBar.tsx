'use client';

import { isEqual } from "lodash";
import { FormStatusDropdown } from "@/app/(app)/environments/[environmentId]/forms/[formId]/components/FormStatusDropdown";
import { TEnvironment } from "@/packages/types/environment";
import { TForm } from "@/packages/types/forms";
import { TProduct } from "@/packages/types/product";
import { AlertDialog } from "@/packages/ui/AlertDialog";
import { Button } from "@/packages/ui/Button"
import { Input } from "@/packages/ui/Input";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { updateFormAction } from "../../../actions";
import toast from "react-hot-toast";

interface FormMenuBarProps {
    localForm: TForm;
    form: TForm;
    setLocalForm: (form: TForm) => void;
    environment: TEnvironment;
    product: TProduct;
}

export const FormMenuBar = ({
    localForm,
    form,
    environment,
    setLocalForm,
    product
}: FormMenuBarProps) => {
    const router = useRouter();
    const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [isFormPublishing, setIsFormPublishing] = useState(false);
    const [isFormSaving, setIsFormSaving] = useState(false);
    const disableSave = useMemo(() => {
        if (isFormSaving) return true;

        if (localForm.status !== "draft") return true;
    }, [isFormSaving, localForm.status]);

    const handleBack = () => {
        const { ...localFormRest } = localForm;
        const { updatedAt: _, ...formRest } = form;

        if (!isEqual(localFormRest, formRest)) {
            setConfirmDialogOpen(true);
        } else {
            router.back();
        }
    };

    const handleFormSave = async () => {
        setIsFormSaving(true);
        try {
            // TODO in future if we want the is Form is valid or not 

            localForm.questions = localForm.questions.map((question) => {
                const { ...rest } = question;
                return rest;
            });

            const updateDForm = await updateFormAction({ ...localForm });

            setIsFormSaving(false);
            setLocalForm(updateDForm);
            toast.success("Changes saved.");
            
        } catch (e) {
            console.error(e);
            setIsFormSaving(false);
            toast.error(`Error saving changes`);
            return;
        }
    };

    const handleSaveAndGoBack = async () => {
        await handleFormSave();
        router.back();
    }

    const handleFormPublish = async () => {
        setIsFormPublishing(true);

        try {
            // TODO in future if we want the is Form is valid or not
            const status = "inProgress"  // TODO if the runOnDate is added then add if the runOnDate is true then status is scheduled else inProgress;
            await updateFormAction({
                ...localForm,
                status,
            });
            setIsFormPublishing(false);
            router.push(`/environments/${environment.id}/forms/${localForm.id}/summary?success=true`);
        } catch (error) {
            toast.error("An error occured while publishin the form.");
            setIsFormPublishing(false);
        }
    };

    return (
        <>
            <div className="border-b border-slate-200 bg-white px-5 py-3 sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center space-x-2 whitespace-nowrap">
                    <Button
                        variant="secondary"
                        StartIcon={ArrowLeftIcon}
                        onClick={() => {
                            handleBack();
                        }}>
                        Back
                    </Button>
                    <p className="hidden pl-4 font-semibold md:block">{product.name} / </p>
                    <Input 
                        defaultValue={localForm.name}
                        onChange={(e) => {
                            const updatedForm = { ...localForm, name: e.target.value };
                            setLocalForm(updatedForm);
                        }}
                        className="w-72 border-white hover:border-slate-200"
                    />
                </div>

                {/*  ToDo after creating the response count here will come the warning message that this form receive the responses */}

                <div className="mt-3 flex sm:ml-4 sm:mt-0">
                    <div className="mr-4 flex items-center">
                        <FormStatusDropdown 
                            form={form}
                            environment={environment}
                            // TODO after comepleting the formStatusDropdown component here will come the ' updateLocalFormStatus ';
                        />
                    </div>
                    <Button
                        disabled={disableSave}
                        variant="secondary"
                        className="mr-3"
                        loading={isFormSaving}
                        onClick={() => handleFormSave() }
                    >
                        Save
                    </Button>
                    {localForm.status !== "draft" && (
                        <Button
                            disabled={disableSave}
                            variant="darkCTA"
                            className="mr-3"
                            loading={isFormSaving}
                            onClick={() => handleSaveAndGoBack() }
                        >
                            Save & Close
                        </Button>
                    )}
                    {localForm.status === "draft" && (
                        <Button
                            disabled={isFormSaving}
                            variant="darkCTA"
                            loading={isFormPublishing}
                            onClick={() => handleFormPublish()}
                        >
                            Publish
                        </Button>
                    )}
                </div>
                <AlertDialog 
                    headerText="Confirm Form Changes"
                    open={isConfirmDialogOpen}
                    setOpen={setConfirmDialogOpen}
                    mainText="You have unsaved changes in your form. Would you like to save them before leaving?"
                    confirmBtnLabel="Save"
                    declineBtnLabel="Discard"
                    declineBtnVariant="warn"
                    onDecline={() => {
                        setConfirmDialogOpen(false);
                        router.back();
                    }}
                    onConfirm={() => handleSaveAndGoBack() }
                />
            </div>
        </>
    )
}