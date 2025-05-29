'use server';

import { authOptions } from "@/packages/lib/authOptions"
import { getForm, getForms } from "@/packages/lib/form/service";
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
}