import {
    composeContext,
    elizaLogger,
    generateObjectDeprecated,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    ModelClass,
    type State,
    type Action,
} from "@elizaos/core";
import { validateCoinMarketCapConfig } from "../../environment";
import { priceExamples } from "./examples";
import { createPriceService } from "./service";
import { getPriceTemplate } from "./template";
import type { GetPriceContent } from "./types";
import { isGetPriceContent } from "./validation";

const CACHE_KEY = 'coinmarketcap:getprice';
const PRICE_EVOLUTION = 'priceEvolution';
const CACHE_TTL = 2 * 30 * 24 * 60 * 60; // 2 months in seconds

export default {
    name: "GET_PRICE",
    similes: [
        "CHECK_PRICE",
        "PRICE_CHECK",
        "GET_CRYPTO_PRICE",
        "CHECK_CRYPTO_PRICE",
        "GET_TOKEN_PRICE",
        "CHECK_TOKEN_PRICE",
    ],
    // eslint-disable-next-line
    validate: async (runtime: IAgentRuntime, _message: Memory) => {
        await validateCoinMarketCapConfig(runtime);
        return true;
    },
    description: "Get the current price of a cryptocurrency from CoinMarketCap",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.log("Starting CoinMarketCap GET_PRICE handler...");

        // Initialize or update state
        let currentState = state;
        if (!currentState) {
            currentState = (await runtime.composeState(message)) as State;
        } else {
            currentState = await runtime.updateRecentMessageState(currentState);
        }

        try {
            // Compose and generate price check content
            const priceContext = composeContext({
                state: currentState,
                template: getPriceTemplate,
            });

            const content = (await generateObjectDeprecated({
                runtime,
                context: priceContext,
                modelClass: ModelClass.SMALL,
            })) as unknown as GetPriceContent;

            // Validate content
            if (!isGetPriceContent(content)) {
                throw new Error("Invalid price check content");
            }

            // Get price from CoinMarketCap
            const config = await validateCoinMarketCapConfig(runtime);

            const priceService = createPriceService(
                config.COINMARKETCAP_API_KEY
            );

            try {
                const priceData = await priceService.getPrice(
                    content.symbol,
                    content.currency
                );
                elizaLogger.success(
                    `Price retrieved successfully! ${content.symbol}: ${priceData.price} ${content.currency.toUpperCase()}`
                );

                const timestamp = new Date().toISOString();
                await runtime.cacheManager.set(`${CACHE_KEY}/${timestamp}`, {
                    ...priceData,
                    timestamp,
                }, { expires: CACHE_TTL });

                console.log('PRICE DATA', priceData);
                
                // Getting the array
                const percentChange1h = await runtime.cacheManager.getAndKeep<number[]>('percentChange1h');

                if (!percentChange1h) {
                    const percentChange1h = []; // Initialize it if undefined
                    percentChange1h.push(priceData?.percentChange1h); 
                    console.log("PERCENT CHANGE 1H", percentChange1h);

                    await runtime.cacheManager.set('percentChange1h',
                        percentChange1h,
                    { expires: CACHE_TTL });
                } else {
                    percentChange1h.push(priceData?.percentChange1h);
                    console.log("PERCENT CHANGE 1H", percentChange1h);
                    
                    await runtime.cacheManager.set('percentChange1h',
                        percentChange1h,
                    { expires: CACHE_TTL });     
                }

                const percentChange24h = await runtime.cacheManager.getAndKeep<number[]>('percentChange24h');

                if (!percentChange24h) {
                    const percentChange24h = []; // Initialize it if undefined
                    percentChange24h.push(priceData?.percentChange24h); 
                    console.log("PERCENT CHANGE 24H", percentChange24h);

                    await runtime.cacheManager.set('percentChange24h',
                        percentChange24h,
                    { expires: CACHE_TTL });
                } else {
                    percentChange24h.push(priceData?.percentChange24h);
                    console.log("PERCENT CHANGE 24H", percentChange24h);

                    await runtime.cacheManager.set('percentChange24h',
                        percentChange24h,
                    { expires: CACHE_TTL });     
                }

                const volumeChange24h = await runtime.cacheManager.getAndKeep<number[]>('volumeChange24h');

                if (!volumeChange24h) {
                    const volumeChange24h = []; // Initialize it if undefined
                    volumeChange24h.push(priceData?.volumeChange24h); 
                    console.log("VOLUME CHANGE 24H", volumeChange24h);

                    await runtime.cacheManager.set('volumeChange24h',
                        volumeChange24h,
                    { expires: CACHE_TTL });
                } else {
                    volumeChange24h.push(priceData?.volumeChange24h);
                    console.log("VOLUME CHANGE 24H", volumeChange24h);
                    
                    await runtime.cacheManager.set('volumeChange24h',
                        volumeChange24h,
                    { expires: CACHE_TTL });     
                }

                const volume24h = await runtime.cacheManager.getAndKeep<number[]>('volume24h');

                if (!volume24h) {
                    const volume24h = []; // Initialize it if undefined
                    volume24h.push(priceData?.volume24h); 
                    console.log("VOLUME 24H", volume24h);

                    await runtime.cacheManager.set('volume24h',
                        volume24h,
                    { expires: CACHE_TTL });
                } else {
                    volume24h.push(priceData?.volume24h);
                    console.log("VOLUME 24H", volume24h);
                    
                    await runtime.cacheManager.set('volume24h',
                        volume24h,
                    { expires: CACHE_TTL });     
                }
                
                if (callback) {
                    callback({
                        text: `The current price of ${content.symbol} at ${timestamp} is ${priceData.price} ${content.currency.toUpperCase()}`,
                        content: {
                            symbol: content.symbol,
                            currency: content.currency,
                            ...priceData,
                        },
                    });
                }

                return true;
            } catch (error) {
                elizaLogger.error("Error in GET_PRICE handler:", error);
                if (callback) {
                    callback({
                        text: `Error fetching price: ${error.message}`,
                        content: { error: error.message },
                    });
                }
                return false;
            }
        } catch (error) {
            elizaLogger.error("Error in GET_PRICE handler:", error);
            if (callback) {
                callback({
                    text: `Error fetching price: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    examples: priceExamples,
} as Action;
