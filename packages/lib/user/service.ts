import { TUser, TUserCreateInput, TUserUpdateInput, ZUserUpdateInput } from "@/packages/types/user";
import { validateInputs } from "../utils/validate";
import { ZId } from "@/packages/types/environment";
import { prisma } from "@/packages/database/client";
import { userCache } from "./cache";
import { cache } from "../cache";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { DatabaseError } from "@/packages/types/errors";
import { TMembership } from "@/packages/types/memberships";
import { deleteMembership, updateMembership } from "../membership/service";
import { deleteOrganization } from "../organization/service";
// import { ResourceNotFoundError } from "@/packages/types/errors";
// import { Prisma } from "@prisma/client";

const responseSelection = {
  id: true,
  name: true,
  email: true,
  emailVerified: true,
  imageUrl: true,
  createdAt: true,
  updatedAt: true,
  identityProvider: true,
  notificationSettings: true,
};

export const getUserByEmail = (email: string): Promise<TUser | null> => 
    cache(
        async () => {
            validateInputs([email, z.string().email()]);

            try {
                const user = await prisma.user.findUnique({
                    where: {
                        email,
                    },
                    select: responseSelection,
                });

                if (user) {
                    return {
                        ...user,
                        notificationSettings: user.notificationSettings as {
                            alert: Record<string, boolean>;
                            weeklySummary: Record<string, boolean>;
                        }
                    };
                }
                return null;
            } catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    throw new DatabaseError(error.message);
                }

                throw error;
            }
        },
        [`getUserByEmail-${email}`],
        {
            tags: [userCache.tag.byEmail(email)],
        }
    )();

const getAdminMemberships = (memberships: TMembership[]): TMembership[] =>
  memberships.filter((membership) => membership.role === "admin");

export const updateUser = async (personId: string, data: TUserUpdateInput): Promise<TUser> => {
    validateInputs([personId, ZId], [data, ZUserUpdateInput.partial()]);

    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: personId,
            },
            data: data,
            select: responseSelection,
        });

        userCache.revalidate({
            email: updatedUser.email,
            id: updatedUser.id,
        });

        return {
            ...updatedUser,
            notificationSettings: updatedUser.notificationSettings as {
                alert: Record<string, boolean>;
                weeklySummary: Record<string, boolean>;
            }
        };
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            throw new DatabaseError("User with this email already exists");
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new DatabaseError(error.message);
        }

        throw error;
    }

}

const deleteUserById = async (id: string): Promise<TUser> => {
  validateInputs([id, ZId]);

  try {
    const user = await prisma.user.delete({
      where: {
        id,
      },
      select: responseSelection,
    });

    userCache.revalidate({
      email: user.email,
      id,
      count: true,
    });

    return user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};


export const createUser = async (data: TUserCreateInput): Promise<TUser> => {
    validateInputs([data, ZUserUpdateInput]);

    try {
        const user = await prisma.user.create({
            data: data,
            select: responseSelection,
        });

        userCache.revalidate({
            email: user.email,
            id: user.id,
            count: true,
        });

        // send new user customer.io to customer.io
        // createCustomerIoCustomer(user); // TODO: Implement this function

        return {
            ...user,
            notificationSettings: user.notificationSettings as {
                alert: Record<string, boolean>;
                weeklySummary: Record<string, boolean>;
            }
        };
    } catch (error) {
        // if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        //     throw new DatabaseErro("User with this email already exists");
        // }

        // if (error instanceof Prisma.PrismaClientKnownRequestError) {
        //     throw new DatabaseError(error.message);
        // }
       
        throw error;
    }
};

export const deleteUser = async (id: string): Promise<TUser> => {
   validateInputs([id, ZId]);
   try {
        const currentUserMemberships = await prisma.membership.findMany({
            where: {
                userId: id,
            },
            include: {
                organization: {
                    select: {
                        id: true,
                        name: true,
                        memberships: true,
                    },
                },
            },
        });

        for (const currentUserMembership of currentUserMemberships) {
            const organizationMemberships = currentUserMembership.organization.memberships;
            const role = currentUserMembership.role;
            const organizationId = currentUserMembership.organizationId;

            const organizationAdminMemberships = getAdminMemberships(organizationMemberships);
            const organizationHasAtLeastOneAdmin = organizationAdminMemberships.length > 0;
            const organizationHasOnlyOneMember = organizationMemberships.length === 1;
            const currentUserIsOrganizationOwner = role === 'owner';
            await deleteMembership(id, organizationId);

            if (organizationHasOnlyOneMember) {
                await deleteOrganization(organizationId);
            } else if (currentUserIsOrganizationOwner && organizationHasAtLeastOneAdmin) {
                const firstAdmin = organizationAdminMemberships[0];
                await updateMembership(firstAdmin.userId, organizationId, { role: "owner" });
            } else if (currentUserIsOrganizationOwner) {
                await deleteOrganization(organizationId);
            }
        }

        const deleteUser = await deleteUserById(id);

        return deleteUser;
   } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new DatabaseError(error.message);
        }
   }
}
