"use client";

import { TForm } from "@/packages/types/forms";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { deleteFormAction, duplicateFormAction, getFormsAction } from "../actions";
import { LoadingSpinner } from "../../LoadingSpinner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../../DropdownMenu";
import { CopyIcon, EyeIcon, LinkIcon, MoreVertical, SquarePenIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { DeleteDialog } from "../../DeleteDialog";

interface FormDropDownMenuProps {
    environmentId: string;
    form: TForm;
    webAppUrl: string;
    duplicateForm: (form: TForm) => void;
    deleteForm: (formId: string) => void;
}

export const FormDropDownMenu = ({
    environmentId,
    form,
    webAppUrl,
    deleteForm,
    duplicateForm
}: FormDropDownMenuProps) => {
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const router = useRouter();

    const fromUrl = useMemo(() => webAppUrl + "/s/" + form.id, [form.id, webAppUrl]);

    const handleDeleteForm = async (form: TForm) => {
        setLoading(true);
        try {
            await deleteFormAction(form.id)
            deleteForm(form.id);
            router.refresh();
            setDeleteDialogOpen(false);
            toast.success("Form deleted successfully");
        } catch(error) {
            toast.error("An error occured while deleting form");
        }
        setLoading(false);
    };

    const duplicateFormAndRefresh = async (formId: string) => {
        setLoading(true);
        try {
            const duplicatedForm = await duplicateFormAction(environmentId, formId);
            router.refresh();
            const transformedDuplicatedForm = await getFormsAction(duplicatedForm.id);
            if (transformedDuplicatedForm) {
                duplicateForm(transformedDuplicatedForm);
            }
            toast.success("Form duplicated successfully.");
        } catch (error) {
            toast.error("Failed to duplicate the form.");
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="opacity-0.2 absolute left-0 top-0 h-full w-full bg-slate-100">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div 
            id={`${form.name.toLowerCase().split(" ").join("-")}-form-actions`}
            onClick={(e) => e.stopPropagation()}>
            <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
                <DropdownMenuTrigger className="z-10 cursor-pointer" asChild>
                    <div className="rounded-lg border p-2 hover:bg-slate-50">
                        <div className="sr-only">Open options</div>
                        <MoreVertical className="h-4 w-4" aria-hidden="true" />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40">
                    <DropdownMenuGroup>
                        <>
                            <DropdownMenuItem>
                                <Link
                                    className="flex w-full items-center"
                                    href={`/environments/${environmentId}/forms/${form.id}/edit`}
                                >
                                    <SquarePenIcon className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <button
                                    type="button"
                                    className="flex w-full items-center"
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        setIsDropDownOpen(false);
                                        duplicateFormAndRefresh(form.id);
                                    }}>
                                    <CopyIcon className="mr-2 h-4 w-4" />
                                    Duplicate
                                </button>
                            </DropdownMenuItem>

                            {form.status !== "draft" && (
                                <>
                                    <DropdownMenuItem>
                                        <div 
                                            className="flex w-full cursor-pointer items-center"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setIsDropDownOpen(false);
                                                const previewUrl = `/s/${form.id}?preview=true`;
                                                window.open(previewUrl, "_blank");
                                            }}>
                                            <EyeIcon className="mr-2 h-4 w-4" />
                                            Preview Form
                                        </div>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem>
                                        <button
                                            type="button"
                                            className="flex w-full items-center"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setIsDropDownOpen(false);
                                                navigator.clipboard.writeText(fromUrl);
                                                toast.success("Copied link to clipboard");
                                                router.refresh();
                                            }}>
                                            <LinkIcon className="mr-2 h-4 w-4" />
                                            Copy Link
                                        </button>
                                    </DropdownMenuItem>
                                </>
                            )}
                            <DropdownMenuItem>
                                <button
                                    type="button"
                                    className="flex w-full items-center"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsDropDownOpen(false)
                                        setDeleteDialogOpen(true);
                                    }}>
                                    <TrashIcon className="mr-2 h-4 w-4" />
                                    Delete
                                </button>
                            </DropdownMenuItem>
                        </>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteDialog
                deleteWhat="Form"
                open={isDeleteDialogOpen}
                setOpen={setDeleteDialogOpen}
                onDelete={() => handleDeleteForm(form)}
                text="Are you sure you want to delete this form and all of its responses? This action cannot be undone."
            />
        </div>
    )
}