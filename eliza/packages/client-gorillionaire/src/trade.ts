import {
    type IAgentRuntime,
    type Memory,
    type Content,
    type State,
} from "@elizaos/core";
import type { ClientBase } from "./base.ts";

export class GorillionaireTradeClient {
    client: ClientBase;
    runtime: IAgentRuntime;

    private stopProcessingActions = false;

    constructor(client: ClientBase, runtime: IAgentRuntime) {
        this.client = client;
        this.runtime = runtime;
    }

    async start() {
        if (!this.client.profile) {
            await this.client.init();
        }

        const processActionsLoop = async () => {
            while (!this.stopProcessingActions) {
                try {
                    console.log("Processing actions...");

                    // Wait for 1 hour before next execution
                    await new Promise((resolve) =>
                        setTimeout(resolve, 60 * 60 * 1000)
                    );
                } catch (error) {
                    console.error("Error in action processing loop:", error);
                    await new Promise((resolve) => setTimeout(resolve, 30000));
                }
            }
        };

        processActionsLoop().catch((error) => {
            console.error("Fatal error in process actions loop:", error);
        });
    }

    async stop() {
        this.stopProcessingActions = true;
    }
}
