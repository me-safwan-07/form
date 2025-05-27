'use server';

import { authOptions } from "@/packages/lib/authOptions";
import { createForm } from "@/packages/lib/form/service";
import { AuthorizationError } from "@/packages/types/errors";
import { TFormInput } from "@/packages/types/forms";
import { getServerSession } from "next-auth";

export const createFormAction = async (environmentId: string, formBody: TFormInput) => {
    const session = await getServerSession(authOptions);
    if (!session) throw new AuthorizationError("Not authenticated");

    // ToDO add the hasUserEnvironmentAccess function upcomming

    return await createForm(environmentId, formBody);
}