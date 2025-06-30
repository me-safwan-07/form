import { TPerson } from "@/packages/types/people";
import { validateInputs } from "../utils/validate";
import { ZId } from "@/packages/types/environment";
import { prisma } from "@/packages/database/client";
import { personCache } from "./cache";
import { Prisma } from "@prisma/client";
import { DatabaseError } from "@/packages/types/errors";
import { cache } from "../cache";
import { ZString } from "@/packages/types/common";

export const selectPerson = {
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  environmentId: true,
};

export const createPerson = async (environmentId: string, userId: string): Promise<TPerson | null> => {
    validateInputs([environmentId, ZId]);

    try {
        const person = await prisma.person.create({
            data: {
                environment: {
                    connect: {
                        id: environmentId,
                    },
                },
                userId,
            },
            select: selectPerson,
        });

        personCache.revalidate({
            id: person.id,
            environmentId,
            userId,
        });

        return person;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // If the person already exists, return it
            if (error.code === "P2002") {
                // Handle the case where the person record already exists
                const existingPerson = await prisma.person.findFirst({
                    where: {
                        environmentId,
                        userId,
                    },
                    select: selectPerson,
                });

                if (existingPerson) {
                    return existingPerson;
                }
            }
            throw new DatabaseError(error.message);
        }

        throw error;
    }
};

export const getPersonByUserId = (environmentId: string, userId: string): Promise<TPerson | null> => 
    cache(
        async () => {
            validateInputs([environmentId, ZId], [userId, ZString]);

            // check if userId exists as a column
            const personWithUserId = await prisma.person.findFirst({
                where: {
                    environmentId,
                    userId,
                },
                select: selectPerson,
            });

            if (personWithUserId) {
                return personWithUserId;
            }

            return null;
        },
        [`getPersonByUserId-${environmentId}-${userId}`],
        {
            tags: [personCache.tag.byEnvironmentIdAndUserId(environmentId, userId)],
        }
    )();