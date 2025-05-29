import { Prisma } from "@prisma/client";
import { cache } from "../cache";
import { DatabaseError } from "@/packages/types/errors";
import { organizationCache } from "../organization/cache";
import { prisma } from "@/packages/database/client";

export const gethasNoOrganizations = (): Promise<boolean> =>
    cache(
        async () => {
            try {
                const organizationCount = await prisma.organization.count();
                console.log("count",organizationCount)
                return organizationCount === 0
            } catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    throw new DatabaseError(error.message);
                }
                throw error;
            }
        },
        ["gethasNoOrganizations"],
        { tags: [organizationCache.tag.byCount()] }
    )();