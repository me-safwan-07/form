import { TMembership, ZMembership } from "@/packages/types/memberships";
import { validateInputs } from "../utils/validate";
import { ZString } from "@/packages/types/common";
import { prisma } from "@/packages/database/client";
import { organizationCache } from "../organization/cache";
import { membershipCache } from "./cache";
import { Prisma } from "@prisma/client";
import { DatabaseError } from "@/packages/types/errors";

export const createMembership = async (
    organizationId: string,
    userId: string,
    data: Partial<TMembership>
): Promise<TMembership> => {
    validateInputs([organizationId, ZString], [userId, ZString], [data, ZMembership.partial()]);

    try {
        const membership = await prisma.membership.create({
            data: {
                userId,
                organizationId,
                accepted: data.accepted,
                role: data.role as TMembership["role"],
            },
        });
        organizationCache.revalidate({
            userId,
        });

        membershipCache.revalidate({
            userId,
            organizationId,
        });

        return membership;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new DatabaseError(error.message);
        }
        throw error;
    }
};