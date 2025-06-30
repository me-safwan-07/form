import { TDisplay, TDisplayCreateInput, TDisplayUpdateInput, ZDisplayCreateInput, ZDisplayUpdateInput } from "@/packages/types/displays";
import { validateInputs } from "../utils/validate";
import { createPerson, getPersonByUserId } from "../person/service";
import { prisma } from "@/packages/database/client";
import { displayCache } from "./cache";
import { Prisma } from "@prisma/client";
import { DatabaseError, ResourceNotFoundError } from "@/packages/types/errors";
import { TPerson } from "@/packages/types/people";
import { connect } from "http2";

export const selectDisplay = {
    id: true,
    createdAt: true,
    updatedAt: true,
    formId: true,
    responseId: true,
    personId: true,
    status: true,
};

export const createDisplay = async (displayInput: TDisplayCreateInput): Promise<TDisplay> => {
    validateInputs([displayInput, ZDisplayCreateInput]);

    const { environmentId, userId, formId } = displayInput;
    try {
        let person;
        if (userId) {
            person = await getPersonByUserId(environmentId, userId);
            if (!person) {
                person = await createPerson(environmentId, userId);
            }
        }
        const display = await prisma.display.create({
            data: {
                form: {
                    connect: {
                        id: formId,
                    },
                },

                ...(person && {
                    person: {
                        connect: {
                            id: person.id,
                        },
                    },
                }),
            },
            select: selectDisplay,
        });
        displayCache.revalidate({
            id: display.id,
            personId: display.personId,
            formId: display.formId,
        });
        return display;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new DatabaseError(error.message);
        }

        throw error;
    }
};

export const updateDisplay = async (
    displayId: string,
    displayInput: TDisplayUpdateInput
): Promise<TDisplay> => {
    validateInputs([displayId, ZDisplayUpdateInput.partial()]);

    let person: TPerson | null = null;
    if (displayInput.userId) {
        person = await getPersonByUserId(displayInput.environmentId, displayInput.userId);
        if (!person) {
            throw new ResourceNotFoundError("Person", displayInput.userId);
        }
    }

    try {
        const data = {
            ...(person?.id && {
                person: {
                    connect: {
                        id: person.id,
                    },
                },
            }),
            ...(displayInput.responseId && {
                responseId: displayInput.responseId,
            }),
        };
        const display = await prisma.display.update({
            where: {
                id: displayId,
            },
            data,
            select: selectDisplay,
        });

        displayCache.revalidate({
            id: display.id,
            formId: display.formId,
        });

        return display;
    } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new DatabaseError(error.message);
        }

        throw error;
    }
};