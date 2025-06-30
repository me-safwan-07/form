import { responses } from "@/app/lib/api/response"
import { transformErrorToDetails } from "@/app/lib/api/validator";
import { createDisplay } from "@/packages/lib/display/service";
import { capturePosthogEnvironment } from "@/packages/lib/posthogServer";
import { ZDisplayCreateInput } from "@/packages/types/displays";
import { InvalidInputError } from "@/packages/types/errors";


interface Context {
    params: {
        environmentId: string;
    };
}

export const OPTIONS = async (): Promise<Response> => {
    return responses.successResponse({}, true);
};

export const POST = async (request: Request, contenxt: Context): Promise<Response> => {
    const jsonInput = await request.json();
    const inputValidation = ZDisplayCreateInput.safeParse({
        ...jsonInput,
        environmentId: contenxt.params.environmentId,
    });

    if (!inputValidation.success) {
        return responses.badRequestResponse(
            "Fields are missing or incorrectly formatted",
            transformErrorToDetails(inputValidation.error),
            true
        );
    }

    // create display
    let response = {};
    try {
        const { id } = await createDisplay(inputValidation.data);
        response = { id };
    } catch (error) {
        if (error instanceof InvalidInputError) {
            return responses.badRequestResponse(error.message);
        } else {
            console.error(error);
            return responses.internalServerErrorResponse(error.message);
        }
    }

    await capturePosthogEnvironment(inputValidation.data.environmentId, "display created");

    return responses.successResponse(response, true);
}