from google.protobuf.json_format import MessageToJson
from proto.v1.envio.envio_pb2 import EnvioPriceEvent

def create_envio_price_event() -> EnvioPriceEvent:
    """Create a new EnvioPriceEvent with sample data."""
    event = EnvioPriceEvent(
        fromAddress="0x123...abc",
        toAddress="0x456...def",
        amount="1000000000000000000",
        blockNumber="12345678",
        blockTimestamp="1679876543",
        transactionHash="0x789...xyz",
        tokenSymbol="ETH",
        tokenName="Ethereum",
        tokenDecimals=18,
        tokenAddress="0x000...000",
        thisHourTransfers=50
    )
    return event

def serialize_event(event: EnvioPriceEvent) -> bytes:
    """Serialize the event to bytes."""
    return event.SerializeToString()

def deserialize_event(serialized: bytes) -> EnvioPriceEvent:
    """Deserialize bytes back to an event."""
    event = EnvioPriceEvent()
    event.ParseFromString(serialized)
    return event

def event_to_json(event: EnvioPriceEvent) -> str:
    """Convert the event to a JSON string."""
    return MessageToJson(event, indent=2)

def main():
    try:
        # Create a new event
        event = create_envio_price_event()
        print("Created event:")
        print(event_to_json(event))

        # Serialize the event
        serialized = serialize_event(event)
        print("\nSerialized event (bytes):")
        print(serialized)

        # Deserialize the event
        deserialized = deserialize_event(serialized)
        print("\nDeserialized event:")
        print(event_to_json(deserialized))

        # Verify the event data
        print("\nVerifying event data:")
        print(f"From Address: {deserialized.fromAddress}")
        print(f"Amount: {deserialized.amount}")
        print(f"Token Symbol: {deserialized.tokenSymbol}")
        print(f"This Hour Transfers: {deserialized.thisHourTransfers}")

    except Exception as e:
        print(f"Error in example: {e}")

if __name__ == "__main__":
    main()
