'use server';

import { authOptions } from "@/packages/lib/authOptions"
import { deleteForm, duplicateForm, getForm, getForms } from "@/packages/lib/form/service";
import { AuthorizationError } from "@/packages/types/errors";
import { TFormFilterCriteria } from "@/packages/types/forms";
import { getServerSession } from "next-auth"

export const getFormsAction = async (
    environmentId: string,
    limit?: number,
    offset?: number,
    filterCriteria?: TFormFilterCriteria
) => {
    const session = await getServerSession(authOptions);
    if (!session) throw new AuthorizationError("Not authorized");

    return await getForms(environmentId, limit, offset, filterCriteria);
};

export const duplicateFormAction = async (environmentId: string, formId: string) => {
    const session = await getServerSession(authOptions);
    if (!session) throw new AuthorizationError("Not authorized");

    const duplicatedForm = await duplicateForm(environmentId, formId, session.user.id);
    return duplicatedForm;
};

export const deleteFormAction = async (formId: string) => {
    const session = await getServerSession(authOptions);
    if (!session) throw new AuthorizationError("Not authorized");

    // const form = await getForm(formId);

    await deleteForm(formId);
}