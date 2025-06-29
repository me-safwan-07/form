import { ResponseAPI } from "./client/response";
import { DisplayAPI } from "./display";
import { ApiConfig } from "./types";

export class Client {
    response: ResponseAPI;
    display: Displ

    constructor(options: ApiConfig) {
        const { apiHost, environmentId } = options;

        this.response = new ResponseAPI(apiHost, environmentId);
        this.display = new DisplayAPI(apiHost, environmentId);
    }
}