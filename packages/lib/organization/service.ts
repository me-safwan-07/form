import { TOrganization, TOrganizationCreateInput, ZOrganizationCreateInput } from "@/packages/types/organizations";
import { cache } from "../cache";
import { validateInputs } from "../utils/validate";
import { ZOptionalNumber, ZString } from "@/packages/types/common";
import { prisma } from "@/packages/database/client";
import { BILLING_LIMITS, ITEMS_PER_PAGE, PRODUCT_FEATURE_KEYS } from "../constants";
import { DatabaseError, ResourceNotFoundError } from "@/packages/types/errors";
import { Prisma } from "@prisma/client";
import { organizationCache } from "./cache";

export const select = {
  id: true,
  createdAt: true,
  updatedAt: true,
  // name: true,
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
        return organizations as [] || [];
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


export const getOrganization = (organizationId: string): Promise<TOrganization | nulll> => 
  cache(
    async () => {
      validateInputs([organizationId, ZString]);

      try {
        const organization = await prisma.organization.findUnique({
          where: {
            id: organizationId,
          },
          select,
        });
        return organization;
      } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getOrganization-${organizationId}`],
    {
      tags: [organizationCache.tag.byId(organizationId)],
    }
  )();

export const createOrganization = async (): Promise<TOrganization> => {
    try {
        // validateInputs([organizationInput, ZOrganizationCreateInput]);

        const organization = await prisma.organization.create({
            data: {
                // name: "",
                billing: {
                    plan: PRODUCT_FEATURE_KEYS.FREE,
                    limits: {
                        monthly: {
                            responses: BILLING_LIMITS.FREE.RESPONSES,
                            miu: BILLING_LIMITS.FREE.MIU,
                        },
                    },
                    stripeCustomerId: null,
                    periodStart: new Date(),
                    period: "monthly",
                },
            },
            select,
        })

        organizationCache.revalidate({
            id: organization.id,
            count: true,
        });

        return organization;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DatabaseError(error.message);
      }

      throw error;
    }
}