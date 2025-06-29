import { TDisplayUpdateInput } from "@/packages/types/displays";
import { NetworkError } from "@/packages/types/errors";
import { makeRequest } from "../utils/makeRequest";
import { Result } from "@/packages/types/errorHandlers";

export class DisplayAPI {
    private apiHost: string;
    private environmentId: string;

    constructor(baseUrl: string, environmentId: string) {
        this.apiHost = baseUrl;
        this.environmentId = environmentId;
    }

    async create(
        displayInput: Omit<TDisplayUpdateInput, "environmentId">
    ): Promise<Result<{ id: string }, NetworkError | Error>> {
        return makeRequest(this.apiHost, `/api/v1/client/${this.environmentId}/displays`, "POST", displayInput);
    }

    async update(
        displayId: string,
        displayInput: Omit<TDisplayUpdateInput, "environmentId">
    ): Promise<Result<{}, NetworkError | Error>> {
        return makeRequest(
            this.apiHost,
            `/api/v1/client/${this.environmentId}/dispalys/${displayId}`,
            "PUT",
            displayInput
        );
    }
}