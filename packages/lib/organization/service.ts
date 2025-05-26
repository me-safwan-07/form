import { TOrganization } from "@/packages/types/organizations";
import { cache } from "../cache";
import { validateInputs } from "../utils/validate";
import { ZOptionalNumber, ZString } from "@/packages/types/common";
import { prisma } from "@/packages/database/client";
import { ITEMS_PER_PAGE } from "../constants";
import { DatabaseError, ResourceNotFoundError } from "@/packages/types/errors";
import { Prisma } from "@prisma/client";
import { organizationCache } from "./cache";

export const select = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  billing: true,
};

export const getOrganizationsByUserId = (userId: string, page?: number): Promise<TOrganization[]> =>
  cache(
    async () => {
      validateInputs([userId, ZString], [page, ZOptionalNumber]);

      try {
        const organizations = await prisma.organization.findMany({
          where: {
            memberships: {
              some: {
                userId,
              },
            },
          },
          select,
          take: page ? ITEMS_PER_PAGE : undefined,
          skip: page ? ITEMS_PER_PAGE * (page - 1) : undefined,
        });
        if (!organizations) {
          throw new ResourceNotFoundError("Organizations by UserId", userId);
        }
        return organizations as [];
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getOrganizationsByUserId-${userId}-${page}`],
    {
      tags: [organizationCache.tag.byUserId(userId)],
    }
  )();