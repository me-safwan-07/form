import { TResponse, TResponseInput, TResponseUpdateInput, ZResponseInput, ZResponseUpdateInput } from "@/packages/types/responses";
import { validateInputs } from "../utils/validate";
import { Prisma } from "@prisma/client";
import { prisma } from "@/packages/database/client";
import { DatabaseError, ResourceNotFoundError } from "@/packages/types/errors";
import { responseCache } from "./cache";
import { ZId } from "@/packages/types/environment";

export const responseSelection = {
    id: true,
    createAt: true,
    updatedAt: true,
    formId: true,
    finished: true,
    data: true,
}

export const createResponse = async (responseInput: TResponseInput): Promise<TResponse> => {
    validateInputs([responseInput, ZResponseInput]);
    // TODO: add the captureTelemetry function 

    const {
        environmentId,
        userId,
        formId,
        finished,
        data,
    } = responseInput;

    try {
        const prismaData: Prisma.ResponseCreateInput = {
            form: {
                connect: {
                    id: formId,
                },
            },
            finished: finished,
            data: data,
        };

        const responsePrisma = await prisma.response.create({
            data: prismaData,
            select: responseSelection,
        });

        // TODO: change the person and data type this is written for the fix the issue
        const response: TResponse = {
            ...responsePrisma,
            // createdAt: responsePrisma.createdAt, // Map createdAt to createdAt if needed by TResponse
            data: (responsePrisma.data ?? {}) as Record<string, string | number | string[] | Record<string, string>>,
            person: null, // or fetch the person if required
        };

        responseCache.revalidate({
            environmentId: environmentId,
            id: response.id,
            formId: response.formId,
        })

        return response;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new DatabaseError(error.message);
        }

        throw error;
    }
};

export const updateResponse = async (
    responseId: string,
    responseInput: TResponseUpdateInput
): Promise<TResponse> => {
    validateInputs([responseId, ZId], [responseInput, ZResponseUpdateInput]);
    try {
        const currentResponse = await prisma.response.findUnique({
            where: {
                id: responseId,
            },
            select: responseSelection,
        });

        if (!currentResponse) {
            throw new ResourceNotFoundError("Response", responseId);
        }

        // merge data object
        const data = {
            ...(typeof currentResponse.data === "object" && currentResponse.data !== null ? currentResponse.data : {}),
            ...responseInput.data,
        }

        const responsePrisma = await prisma.response.update({
            where: {
                id: responseId,
            },
            data: {
                finished: responseInput.finished,
                data,
            },
            select: responseSelection,
        });
        
        // TODO: change the person and data type this is written for the fix the issue
        const response: TResponse = {
            ...responsePrisma,
            // createdAt: responsePrisma.createdAt, // Map createdAt to createdAt if needed by TResponse
            data: (responsePrisma.data ?? {}) as Record<string, string | number | string[] | Record<string, string>>,
            person: null, // or fetch the person if required
        };

        responseCache.revalidate({
            id: response.id,
            // personId: response.person?.id,
            formId: response.formId,
        });

        return response;
    }
}