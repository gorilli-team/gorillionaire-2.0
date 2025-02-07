import {
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    type Action,
    Content,
    generateText,
    ModelClass,
} from "@elizaos/core";

export const currentNewsAction: Action = {
    name: "CURRENT_NEWS",
    similes: ["NEWS"],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        return true;
    },
    description: "Fetch current news for memecoins on base",
    handler: async (
        _runtime: IAgentRuntime,
        _message: Memory,
        _state: State,
        _options: {
            [key: string]: unknown;
        },
        _callback: HandlerCallback
    ): Promise<boolean> => {
        async function getCurrentNews(searchTerm: string) {
            const response = await fetch(
                `https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=${process.env.NEWS_API_KEY}`
            );

            const data = await response.json();

            return data.articles
                .slice(0, 5)
                .map((article) => `${article.title}`);
        }

        const context = `Extract the search term from the user's message. The message is ${_message.content.text}
        Only respond with the search term, do not include any other text`;

        const searchTerm = await generateText({
            runtime: _runtime,
            context,
            modelClass: ModelClass.SMALL,
            stop: ["\n"],
        });

        const currentNews = await getCurrentNews(searchTerm);

        const newMemory: Memory = {
            userId: _message.agentId,
            agentId: _message.agentId,
            roomId: _message.roomId,
            content: {
                text: currentNews,
                action: "CURRENT_NEWS_RESPONSE",
                source: _message.content.source,
            } as Content,
        };

        console.log("memory", newMemory);

        await _runtime.messageManager.createMemory(newMemory);

        _callback({
            text: `The current news for topic are ${currentNews}`,
        });

        return true;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "Can you say hello?", action: "HELLO_WORLD" },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "HELLO_WORLD" },
            },
        ],

        [
            {
                user: "{{user1}}",
                content: {
                    text: "What's a classic greeting?",
                },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "HELLO_WORLD" },
            },
        ],

        [
            {
                user: "{{user1}}",
                content: {
                    text: "Give me a friendly greeting!",
                },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "HELLO_WORLD" },
            },
        ],

        [
            {
                user: "{{user1}}",
                content: {
                    text: "I need a cheerful hello!",
                },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "HELLO_WORLD" },
            },
        ],

        [
            {
                user: "{{user1}}",
                content: {
                    text: "What do you say to start a conversation?",
                },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "HELLO_WORLD" },
            },
        ],

        [
            {
                user: "{{user1}}",
                content: { text: "Can you greet me?" },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "HELLO_WORLD" },
            },
        ],

        [
            {
                user: "{{user1}}",
                content: {
                    text: "What's your favorite phrase?",
                },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "HELLO_WORLD" },
            },
        ],

        [
            {
                user: "{{user1}}",
                content: {
                    text: "How do you introduce yourself?",
                },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "HELLO_WORLD" },
            },
        ],
    ] as ActionExample[][],
} as Action;
