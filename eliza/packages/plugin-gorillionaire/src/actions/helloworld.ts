import {
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    type Action,
} from "@elizaos/core";

export const helloWorldAction: Action = {
    name: "HELLO_WORLD",
    similes: ["HELLO"],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        return true;
    },
    description: "Make a cool hello world ASCII art",
    handler: async (
        _runtime: IAgentRuntime,
        _message: Memory,
        _state: State,
        _options: {
            [key: string]: unknown;
        },
        _callback: HandlerCallback
    ): Promise<boolean> => {
        const helloWorld = `This is definitely Working, luduvigo made it`;

        _callback({
            text: helloWorld,
        });

        return true;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What's the latest news?",
                    action: "CURRENT_NEWS",
                },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "CURRENT_NEWS" },
            },
        ],

        [
            {
                user: "{{user1}}",
                content: {
                    text: "Can you fetch current news for me?",
                },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "CURRENT_NEWS" },
            },
        ],

        [
            {
                user: "{{user1}}",
                content: {
                    text: "Tell me what's happening in the world.",
                },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "CURRENT_NEWS" },
            },
        ],

        [
            {
                user: "{{user1}}",
                content: {
                    text: "I want to know the current news updates.",
                },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "CURRENT_NEWS" },
            },
        ],

        [
            {
                user: "{{user1}}",
                content: {
                    text: "What's trending in the news right now?",
                },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "CURRENT_NEWS" },
            },
        ],

        [
            {
                user: "{{user1}}",
                content: {
                    text: "Can you give me the latest headlines?",
                },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "CURRENT_NEWS" },
            },
        ],

        [
            {
                user: "{{user1}}",
                content: {
                    text: "What are the top news stories today?",
                },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "CURRENT_NEWS" },
            },
        ],

        [
            {
                user: "{{user1}}",
                content: {
                    text: "Give me a news update.",
                },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "CURRENT_NEWS" },
            },
        ],
    ] as ActionExample[][],
} as Action;

export const noneAction = {
    name: "none",
    description: "Do nothing",
    execute: async () => {
        return { success: true };
    },
};
