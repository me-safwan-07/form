import { TOrganization } from "@/packages/types/organizations";
import { cache } from "../cache";
import { validateInputs } from "../utils/validate";
import { ZOptionalNumber, ZString } from "@/packages/types/common";
import { ITEMS_PER_PAGE } from "../constants";
import { DatabaseError, ResourceNotFoundError } from "@/packages/types/errors";
import { organizationCache } from "./cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/packages/database/client";
import { ZId } from "@/packages/types/environment";
import { environmentCache } from "../environment/cache";

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
        const organization = await prisma.organization.findMany({
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

        if (!organization) {
          throw new ResourceNotFoundError("Organizations by UserId", userId);
        }
        return organization;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getOrganizationsByUserId-${userId}-${page}`],
    {
      tags: [organizationCache.tag.byUserId(userId)]
    }
  )();

export const createOrganization = async (): Promise<TOrganization> => {
  try {
    // validateInputs([organizationInput, ZOrganizationCreateInput]);

    const organization = await prisma.organization.create({
      data:{},
      select,
    });

    // const product = await prisma.product.create({

    // })

    return organization;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export const deleteOrganization = async (organizationId: string): Promise<TOrganization> => {
  validateInputs([organizationId, ZId]);
  try {
    const deletedOrganization = await prisma.organization.delete({
      where: {
        id: organizationId,
      },
      select: { ...select, memberships: true, products: { select: { environments: true } } },  // include memberships & environments
    });

    // revalidate cache for members
    deletedOrganization?.memberships.forEach((membership) => {
      organizationCache.revalidate({
        userId: membership.userId,
      });
    });
    
    // revalidate cache for environments
    deletedOrganization?.products.forEach((product) => {
      product.environments.forEach((environment) => {
        environmentCache.revalidate({
          id: environment.id,
        });

        organizationCache.revalidate({
          environmentId: environment.id,
        });
      });
    });


    const organization = {
      ...deletedOrganization,
      memberships: undefined,
      products: undefined,
    };

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
};

