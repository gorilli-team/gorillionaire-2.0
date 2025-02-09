import axios from "axios";
import type { ApiResponse, PriceData } from "./types";

const BASE_URL = "https://pro-api.coinmarketcap.com/v1";

export const createPriceService = (apiKey: string) => {
    const client = axios.create({
        baseURL: BASE_URL,
        headers: {
            "X-CMC_PRO_API_KEY": apiKey,
            Accept: "application/json",
        },
    });

    let pollInterval: NodeJS.Timeout | null = null;

    const getPrice = async (
        symbol: string,
        currency: string
    ): Promise<PriceData> => {
        const normalizedSymbol = "BRETT";
        const normalizedCurrency = "USD";

        console.log(new Date().toISOString(), 'normalizedSymbol', normalizedSymbol);
        console.log(new Date().toISOString(), 'normalizedCurrency', normalizedCurrency);

        try {
            const response = await client.get<ApiResponse>(
                "/cryptocurrency/quotes/latest",
                {
                    params: {
                        symbol: normalizedSymbol,
                        convert: normalizedCurrency,
                    },
                }
            );

            const symbolData = response.data.data[normalizedSymbol];
            if (!symbolData) {
                throw new Error(
                    `No data found for symbol: ${normalizedSymbol}`
                );
            }

            const quoteData = symbolData.quote[normalizedCurrency];
            if (!quoteData) {
                throw new Error(
                    `No quote data found for currency: ${normalizedCurrency}`
                );
            }

            return {
                price: quoteData.price,
                marketCap: quoteData.market_cap,
                volume24h: quoteData.volume_24h,
                volumeChange24h: quoteData.volume_change_24h,
                percentChange1h: quoteData.percent_change_1h,
                percentChange24h: quoteData.percent_change_24h,
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.status?.error_message ||
                    error.message;
                console.error("API Error:", errorMessage);
                throw new Error(`API Error: ${errorMessage}`);
            }
            throw error;
        }
    };

    const startPolling = (
        symbol: string,
        currency: string,
        intervalSeconds: number = 120, // Default to 2 minutes
        onPrice: (price: PriceData) => void,
        onError?: (error: Error) => void
    ) => {
        const handlePricePollingLoop = async () => {
            try {
                const price = await getPrice(symbol, currency);
                onPrice(price);
            } catch (error) {
                if (onError && error instanceof Error) {
                    onError(error);
                }
            }
            pollInterval = setTimeout(
                handlePricePollingLoop,
                intervalSeconds * 1000
            );
        };

        handlePricePollingLoop();
    };

    const stopPolling = () => {
        if (pollInterval) {
            clearTimeout(pollInterval);
            pollInterval = null;
        }
    };

    return { getPrice, startPolling, stopPolling };
};
