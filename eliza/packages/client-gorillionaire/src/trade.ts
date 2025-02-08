import {
    type IAgentRuntime,
} from "@elizaos/core";
import type { ClientBase } from "./base.ts";
import { coinmarketcapPlugin } from "@elizaos/plugin-coinmarketcap";


export class GorillionaireTradeClient {
    client: ClientBase;
    runtime: IAgentRuntime;
    
    private stopProcessingActions = false;

    constructor(client: ClientBase, runtime: IAgentRuntime) {
        this.client = client;
        this.runtime = runtime;

        // console.log('PLUGINS', runtime.plugins)

        // Log configuration on initialization
        console.log("TRADE Client Configuration:");
        console.log(
            `GORILLIOTRADE - Action Interval: ${this.client.twitterConfig.ACTION_INTERVAL} minutes`
        );
    }

    async start() {
        if (!this.client.profile) {
            await this.client.init();
        }

        const processActionsLoop = async () => {

            while (!this.stopProcessingActions) {
                try {

                        const coinmarketcap = await this.runtime.plugins.find(plugin => plugin.name === "coinmarketcap");
                        console.log(coinmarketcap);             

                        const getPrice = await coinmarketcap.actions["GET_PRICE"];

                        console.log(
                            `GORILLIOTRADE - Next action processing scheduled in 15 minutes`
                        );

                        // Wait for the full interval before next processing
                        await new Promise(
                            (resolve) =>
                                setTimeout(resolve, 15 * 60 * 1000) // now in minutes
                        );
                
                } catch (error) {
                    console.error(
                        "Error in action processing loop:",
                        error
                    );
                    // Add exponential backoff on error
                    await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30s on error
                }
            }
        };

        processActionsLoop().catch((error) => {
            console.error(
                "Fatal error in process actions loop:",
                error
            );
        });
    }

    async stop() {
        this.stopProcessingActions = true;
    }


}
