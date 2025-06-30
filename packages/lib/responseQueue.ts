import { PlayerFormAPI } from "../api";
import { TResponseUpdate } from "../types/responses";
import { FormState } from "./formState";
import { delay } from "./utils/promises";

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
        if (this.config.setFormState) {
            this.config.setFormState(this.formState);
        }
        // add response to queue
        this.queue.push(responseUpdate);
        this.processQueue();
    }

    async processQueue() {
        if (this.isRequestInProgress) return;
        if (this.queue.length === 0) return;

        this.isRequestInProgress = true;
        
        const responseUpdate = this.queue[0];
        let attempts = 0;

        while (attempts < this.config.retryAttempts) {
            const success = await this.sendResponse(responseUpdate);
            if (success) {
                this.queue.shift(); // remove the successfully sent response from  the queue
                break; // exit the retry loop
            }
            console.error(`PlayerForm: Failed to send response. Retrying... ${attempts}`);
            await delay(1000); // wait for 1 second before retrying
            attempts++;
        }

        if (attempts >= this.config.retryAttempts) {
            // Inform the user after 2 failed attempts
            console.error("Failed to send response after 2 attempts.");
            // If the response fails finally, inform the user
            if (this.config.onResponseSendingFailed) {
                this.config.onResponseSendingFailed(responseUpdate);
            }
            this.isRequestInProgress = false;
        } else {
            if (responseUpdate.finished && this.config.onResponseSendingFinished) {
                this.config.onResponseSendingFinished();
            }
            this.isRequestInProgress = false;
            this.processQueue(); // process the next item in the queue if any
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
                        await this.api.client.display.update(this.formState.displayId, {
                            responseId: response.data.id,
                        });
                    } catch (error) {
                        console.error(`Failed to update display, proceeding with the response. ${error}`);
                    }
                }
                this.formState.updateResponseId(response.data.id);
                if (this.config.setFormState) {
                    this.config.setFormState(this.formState);
                }
            }
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    // update formState
    updateFormState(formState: FormState) {
        this.formState = formState;
    }
}