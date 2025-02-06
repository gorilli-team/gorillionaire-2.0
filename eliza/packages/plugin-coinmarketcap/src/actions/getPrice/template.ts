export const getPriceTemplate = `Respond with a JSON object containing BOTH symbol and currency. Currency must default to "USD" if not specified.

Here are the cryptocurrency symbol mappings:
- bitcoin/btc -> BTC
- ethereum/eth -> ETH
- solana/sol -> SOL
- cardano/ada -> ADA
- ripple/xrp -> XRP
- dogecoin/doge -> DOGE
- polkadot/dot -> DOT
- usdc -> USDC
- tether/usdt -> USDT
- brett -> BRETT
- toshi -> TOSHI
- akuma inu -> AKUMA
- ski mask dog -> SKI
- degen -> DEGEN
- keyboard cat -> KEYCAT
- higher -> HIGHER
- baby tiger -> BBT
- doginme -> DOGINME
- based pepe -> PEPE

IMPORTANT: Response must ALWAYS include both "symbol" and "currency" fields.

Example response:
\`\`\`json
{
    "symbol": "BTC",
    "currency": "USD"
}
\`\`\`

{{recentMessages}}

Extract the cryptocurrency from the most recent message. Always include currency (default "USD").
Respond with a JSON markdown block containing both symbol and currency.`;
