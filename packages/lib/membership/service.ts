import { TMembership, TMembershipUpdateInput, ZMembership, ZMembershipUpdateInput } from "@/packages/types/memberships";
import { validateInputs } from "../utils/validate";
import { ZString } from "@/packages/types/common";
import { prisma } from "@/packages/database/client";
import { organizationCache } from "../organization/cache";
import { membershipCache } from "./cache";
import { Prisma } from "@prisma/client";
import { DatabaseError, ResourceNotFoundError } from "@/packages/types/errors";

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

export const updateMembership = async (
  userId: string,
  organizationId: string,
  data: TMembershipUpdateInput
): Promise<TMembership> => {
  validateInputs([userId, ZString], [organizationId, ZString], [data, ZMembershipUpdateInput]);

  try {
    const membership = await prisma.membership.update({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
      data,
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
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2016") {
      throw new ResourceNotFoundError("Membership", `userId: ${userId}, organizationId: ${organizationId}`);
    }

    throw error;
  }
}

export const deleteMembership = async (userId: string, organizationId: string): Promise<TMembership> => {
  validateInputs([userId, ZString], [organizationId, ZString]);

  try {
    const deletedMembership = await prisma.membership.delete({
      where: {
        userId_organizationId: {
          organizationId,
          userId,
        },
      },
    });

    organizationCache.revalidate({
      userId,
    });

    membershipCache.revalidate({
      userId,
      organizationId,
    });

    return deletedMembership;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};