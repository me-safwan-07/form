import { Result } from "@/packages/types/errorHandlers";
import { NetworkError } from "@/packages/types/errors";
import { TResponseInput, TResponseUpdateInput } from "@/packages/types/responses";
import { makeRequest } from "../utils/makeRequest";

type TResponseUpdateInputWithResponseId = TResponseUpdateInput & { responseId: string };


export class ResponseAPI {
    private apiHost: string;
    private environmentId: string;

    constructor(apiHost: string, environmentId: string) {
        this.apiHost = apiHost;
        this.environmentId = environmentId;
    }

    async create(
        responseInput: Omit<TResponseInput, "environmentId">
    ): Promise<Result<{ id: string }, NetworkError | Error>> {
        return makeRequest(this.apiHost, `/api/v1/client/${this.environmentId}/responses`, "POST", responseInput);
    }

    async update({
        responseId,
        finished,
        data,
    }: TResponseUpdateInputWithResponseId): Promise<Result<{}, NetworkError | Error>> {
        return makeRequest(this.apiHost, `/api/v1/client/${this.environmentId}/responses/${responseId}`, "PUT", {
            finished,
            data,
        });
    }
}