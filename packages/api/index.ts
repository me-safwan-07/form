import { Client } from "./client";
import { ApiConfig } from "./types";

export class PlayerFormAPI {
    client: Client;

    constructor(options: ApiConfig) {
        this.client = new Client(options);
    }
}