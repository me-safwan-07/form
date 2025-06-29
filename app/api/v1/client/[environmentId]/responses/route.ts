import { responses } from "@/app/lib/api/response";
import { transformErrorToDetails } from "@/app/lib/api/validator";
import { getForm } from "@/packages/lib/form/service";
import { ZId } from "@/packages/types/environment";
import { TResponse, ZResponseInput } from "@/packages/types/responses";
import { headers } from "next/headers";

interface Context {
    params: {
        environmentId: string;
    };
}

export const OPTIONS = async (): Promise<Response> => {
    return responses.successResponse({}, true);
}

export const POST = async (request: Request, context: Context): Promise<Response> => {
    const { environmentId } = context.params;
    const environmentIdValidation = ZId.safeParse(environmentId);

    if (!environmentIdValidation.success) {
        return responses.badRequestResponse(
            "Failed are missing or incorrectly formatted",
            transformErrorToDetails(environmentIdValidation.error),
            true,
        );
    }

    const responseInput = await request.json();

    const agent = UAParser(request.headers.get("user-agent"));
    const headersList = await headers();
     const country =
        headersList.get("CF-IPCountry") ||
        headersList.get("X-Vercel-IP-Country") ||
        headersList.get("CloudFront-Viewer-Country") ||
        undefined;
    const inputValidation = ZResponseInput.safeParse({ ...responseInput, environmentId });

    if (!inputValidation.success) {
        return responses.badRequestResponse(
            "Fields are missing or incorrectly formatted",
            transformErrorToDetails(inputValidation.error),
            true,
        );
    }

    // get and check form
    const form = await getForm(responseInput.formId);
    if (!form) {
        return responses.notFoundResponse("Form", responseInput.formId, true);
    }

    if (form.environmentId !== environmentId) {
        return responses.badRequestResponse(
            "Form is part of another environment",
            {
                "form.environmentId": form.environmentId,
                environmentId,
            },
            true
        );
    }

    let response: TResponse;
    try {
        response = await createRe
    }
}