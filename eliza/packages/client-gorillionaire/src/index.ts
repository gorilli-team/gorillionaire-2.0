import { type Client, elizaLogger, type IAgentRuntime } from "@elizaos/core";
import { ClientBase } from "./base.ts";
import { validateTwitterConfig, type TwitterConfig } from "./environment.ts";
import { GorillionaireInteractionClient } from "./interactions.ts";
import { GorillionairePostClient } from "./post.ts";
import { TwitterSearchClient } from "./search.ts";
import { GorillionaireTradeClient } from "./trade.ts";

/**
 * A manager that orchestrates all specialized Twitter logic:
 * - client: base operations (login, timeline caching, etc.)
 * - post: autonomous posting logic
 * - search: searching tweets / replying logic
 * - interaction: handling mentions, replies
 * - space: launching and managing Twitter Spaces (optional)
 */
class GorillionaireManager {
    client: ClientBase;
    post: GorillionairePostClient;
    //search: TwitterSearchClient;
    interaction: GorillionaireInteractionClient;
    trade: GorillionaireTradeClient;

    constructor(runtime: IAgentRuntime, twitterConfig: TwitterConfig) {

        console.log('--- RUNNING GorillionaireManager');

        // Pass twitterConfig to the base client
        this.client = new ClientBase(runtime, twitterConfig);

        // Posting logic
        this.post = new GorillionairePostClient(this.client, runtime);

        //Mentions and interactions
        this.interaction = new GorillionaireInteractionClient(this.client, runtime);

        //Trading activities
        this.trade = new GorillionaireTradeClient(this.client, runtime);

        console.log("--- YO");
    }
}

export const GorillionaireClientInterface: Client = {
    async start(runtime: IAgentRuntime) {

        console.log('GORILLI -> STARTING CLIENT INTERFACE');
        const twitterConfig: TwitterConfig =
            await validateTwitterConfig(runtime);
        console.log('GORILLI -> AFTER TWITTER CONFIG');

        const manager = new GorillionaireManager(runtime, twitterConfig);
        console.log('GORILLI -> AFTER MANAGER');

        // Initialize login/session
        await manager.client.init();
        console.log('GORILLI -> AFTER MANAGER CLIENT INIT');

        // Start the posting loop
        await manager.post.start();
        console.log('GORILLI -> AFTER POST LOOP START');

        // Start interactions (mentions, replies)
        await manager.interaction.start();
        console.log('GORILLI -> AFTER MANAGER INTERACTION START');

        // Start trading checks
        await manager.trade.start();
        console.log('GORILLI -> AFTER TRADE START');

        return manager;
    },

    async stop(_runtime: IAgentRuntime) {
        elizaLogger.warn("Gorillionaire client does not support stopping yet");
    },
};

export default GorillionaireClientInterface;
