'use server';

import { authOptions } from "@/packages/lib/authOptions";
import { createMembership } from "@/packages/lib/membership/service";
import { createOrganization } from "@/packages/lib/organization/service";
import { AuthorizationError } from "@/packages/types/errors";
import { Organization } from "@prisma/client";
import { getServerSession } from "next-auth";

export const createOrganizationAction = async (organizationName: string):Promise<Organization> => {
    const session = await getServerSession(authOptions);
    if (!session) throw new AuthorizationError("Not authenticated");

    const newOrganization = await createOrganization({
        name: organizationName,
    });

    await createMembership(newOrganization.id, session.user.id, {
        role: "owner",
        accepted: true,
    });

    return newOrganization;
};