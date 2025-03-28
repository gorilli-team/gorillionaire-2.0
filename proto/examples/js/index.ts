import { EnvioPriceEvent } from '../../gen/v1/typescript/proto/v1/envio/envio';

// Example of creating a new EnvioPriceEvent
function createEnvioPriceEvent(): EnvioPriceEvent {
    const event = EnvioPriceEvent.create({
        FromAddress: "0x123...abc",
        ToAddress: "0x456...def",
        Amount: "1000000000000000000", // 1 ETH in wei
        BlockNumber: "12345678",
        BlockTimestamp: "1679876543",
        TransactionHash: "0x789...xyz",
        TokenSymbol: "ETH",
        TokenName: "Ethereum",
        TokenDecimals: 18,
        TokenAddress: "0x000...000",
        ThisHourTransfers: 50
    });

    return event;
}

// Example of serializing the event to bytes
function serializeEvent(event: EnvioPriceEvent): Uint8Array {
    return EnvioPriceEvent.encode(event).finish();
}

// Example of deserializing bytes back to an event
function deserializeEvent(bytes: Uint8Array): EnvioPriceEvent {
    return EnvioPriceEvent.decode(bytes);
}

// Example of converting event to JSON
function eventToJson(event: EnvioPriceEvent): string {
    return JSON.stringify(EnvioPriceEvent.toJSON(event), null, 2);
}

// Example usage
async function main() {
    try {
        // Create a new event
        const event = createEnvioPriceEvent();
        console.log("Created event:", eventToJson(event));

        // Serialize the event
        const serialized = serializeEvent(event);
        console.log("Serialized event (bytes):", serialized);

        // Deserialize the event
        const deserialized = deserializeEvent(serialized);
        console.log("Deserialized event:", eventToJson(deserialized));

        // Verify the event data
        console.log("\nVerifying event data:");
        console.log("From Address:", deserialized.FromAddress);
        console.log("Amount:", deserialized.Amount);
        console.log("Token Symbol:", deserialized.TokenSymbol);
        console.log("This Hour Transfers:", deserialized.ThisHourTransfers);

    } catch (error) {
        console.error("Error in example:", error);
    }
}

// Run the example
main().catch(console.error);
