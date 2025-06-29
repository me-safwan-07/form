import { PlayerFormAPI } from "../api";
import { TResponseData, TResponseUpdate } from "../types/responses";
import { FormState } from "./formState";

interface QueueConfig {
    apiHost: string;
    environmentId: string;
    retryAttempts: number;
    onResponseSendingFailed?: (responseUpdate: TResponseUpdate) => void;
    onResponseSendingFinished?: () => void;
    setFormState?: (state: FormState) => void;
}

export class ResponseQueue {
    private queue: TResponseUpdate[] = [];
    private config: QueueConfig;
    private formState: FormState;
    private isRequestInProgress: boolean = false;
    private api: PlayerFormAPI;

    constructor(config: QueueConfig, formState: FormState) {
        this.config = config;
        this.formState = formState;
        this.api = new PlayerFormAPI({
            apiHost: config.apiHost,
            environmentId: config.environmentId,
        });
    }

    add(responseUpdate: TResponseUpdate) {
        // update form State
        this.formState.accumulateResponse(responseUpdate);
        // add response to queue
        this.queue.push(responseUpdate);
    }

    async processQueue() {
        if (this.isRequestInProgress) return;
        if (this.queue.length === 0) return;

        this.isRequestInProgress = true;
        
        const responseUpdate = this.queue[0];
        let attempts = 0;

        while (attempts < this.config.retryAttempts) {
            const success = await this.sen
        }
    }

    async sendResponse(responseUpdate: TResponseUpdate): Promise<boolean> {
        try {
            if (this.formState.responseId !==  null) {
                await this.api.client.response.update({ ...responseUpdate, responseId: this.formState.responseId });
            } else {
                const response = await this.api.client.response.create({
                    ...responseUpdate,
                    formId: this.formState.formId,
                    userId: this.formState.userId || null,
                    data: { ...responseUpdate.data },
                });

                if (!response.ok) {
                    throw new Error("Could not crate response");
                }
                if (this.formState.displayId) {
                    try {
                        await this.api.client.display.update(t)
                    }
                }

            }
        }
    }
}