import {
    type IAgentRuntime,
    type Memory,
    type Content,
    type State
} from "@elizaos/core";
import type { ClientBase } from "./base.ts";
import { coinmarketcapPlugin } from "@elizaos/plugin-coinmarketcap";
import { getEmbeddingZeroVector } from "@elizaos/core";
import { stringToUuid } from "@elizaos/core";

export class GorillionaireTradeClient {
    client: ClientBase;
    runtime: IAgentRuntime;
    
    private stopProcessingActions = false;

    constructor(client: ClientBase, runtime: IAgentRuntime) {
        this.client = client;
        this.runtime = runtime;

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
                    
                    if (!coinmarketcap) {
                        throw new Error("Coinmarketcap plugin not found");
                    }

                    // Find the GET_PRICE action
                    const getPriceAction = coinmarketcap.actions.find(
                        action => action.name === "GET_PRICE"
                    );

                    if (!getPriceAction) {
                        throw new Error("GET_PRICE action not found");
                    }

                    // Create the content object
                    const content: Content = {
                        text: "Get price for BRETT",
                        source: "trade",
                        attachments: [{
                            id: stringToUuid(`price-request-${Date.now()}`),
                            url: "",
                            title: "Price Request",
                            source: "trade",
                            description: "Request for cryptocurrency price",
                            text: "Get price for BRETT",
                        }]
                    };

                    const userId = stringToUuid(
                        `trade-${this.runtime.agentId}`
                    );
                    const roomId = stringToUuid(
                        `trade-${this.runtime.agentId}`
                    );
                    const messageId = stringToUuid(
                        `trade-${this.runtime.agentId}`
                    );

                    const memory: Memory = {
                        id: messageId,
                        userId,
                        agentId: this.runtime.agentId,
                        roomId,
                        content,
                        createdAt: Date.now(),
                        embedding: getEmbeddingZeroVector(),
                    };

                    // Create a proper State object
                    const state: State = {
                        bio: "",
                        lore: "",
                        messageDirections: "",
                        postDirections: "",
                        conversationTone: "",
                        currentTask: "",
                        taskList: [],
                        taskStatus: "idle",
                        roomId,
                        actors: "",
                        recentMessages: "",
                        recentMessagesData: []
                    };

                    // Call the GET_PRICE action with all required parameters
                    try {
                        const priceResult = await getPriceAction.handler(
                            this.runtime,
                            memory,
                            state,
                            {
                                symbol: "BRETT",
                                currency: "USD"
                            }
                        );

                        console.log("Price result:", priceResult);
                    } catch (actionError) {
                        console.error("Error executing GET_PRICE action:", actionError);
                    }

                    await new Promise(
                        (resolve) => setTimeout(resolve, 15 * 60 * 1000)
                    );
                
                } catch (error) {
                    console.error(
                        "Error in action processing loop:",
                        error
                    );
                    await new Promise((resolve) => setTimeout(resolve, 30000));
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