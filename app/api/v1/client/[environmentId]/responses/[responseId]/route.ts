import { responses } from "@/app/lib/api/response"
import { transformErrorToDetails } from "@/app/lib/api/validator";
import { updateResponse } from "@/packages/lib/response/service";
import { DatabaseError, InvalidInputError, ResourceNotFoundError } from "@/packages/types/errors";
import { ZResponseUpdateInput } from "@/packages/types/responses";

export const OPTIONS = async (): Promise<Response> => {
    return responses.successResponse({}, true);
};

export const PUT = async (
    request: Request,
    { params }: { params: { responseId: string } }
): Promise<Response> => {
    const { responseId } = params;

    if (!responseId) {
        return responses.badRequestResponse("Response ID is missing", undefined, true);
    }

    const responseUpdate = await request.json();

    const inputValidation = ZResponseUpdateInput.safeParse(responseUpdate);

    if (!inputValidation.success) {
        return responses.badRequestResponse(
            "Fields are missing or incorrectly formatted",
            transformErrorToDetails(inputValidation.error),
            true,
        );
    }

    // update response
    // let response;
    try {
        await updateResponse(responseId, inputValidation.data);
    } catch (error) {
        if (error instanceof ResourceNotFoundError) {
            return responses.notFoundResponse("Response", responseId, true);
        }
        if (error instanceof InvalidInputError) {
            return responses.badRequestResponse(error.message);
        }
        if (error instanceof DatabaseError) {
            console.error(error);
            return responses.internalServerErrorResponse(error.message);
        }
    }

    // get form to get environmentId
    // try { 
    //     const form = await getForm(response.formId);
    // } catch (error) {
    //     if (error instanceof InvalidInputError) {
    //         return responses.badRequestResponse(error.message);
    //     }
    //     if (error instanceof DatabaseError) {
    //         console.error(error);
    //         return responses.internalServerErrorResponse(error.message);
    //     }
    // }

    return responses.successResponse({}, true);
}