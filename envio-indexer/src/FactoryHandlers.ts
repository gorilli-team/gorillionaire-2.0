import {
  UniswapPoolFactory,
  TokenListed,
  handlerContext,
  UniswapPoolFactory_PoolCreated_event,
} from "generated";

UniswapPoolFactory.PoolCreated.handler(async ({ event, context }) => {
  const token0Address = event.params.token0;
  const token1Address = event.params.token1;

  const token0 = await context.TokenListed.get(token0Address);
  if (!token0) {
    await handleNewListing(token0Address, event, context);
  }

  const token1 = await context.TokenListed.get(token1Address);
  if (!token1) {
    await handleNewListing(token1Address, event, context);
  }
});

async function handleNewListing(
  address: string,
  event: UniswapPoolFactory_PoolCreated_event,
  context: handlerContext
) {
  const entity: TokenListed = {
    id: address,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
  };
  context.TokenListed.set(entity);

  //   try {
  //     // Store the token in the database via a POST request to the backend
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/signals/listing`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           tokenAddress: entity.id.toString(),
  //           blockNumber: entity.blockNumber.toString(),
  //           blockTimestamp: entity.blockTimestamp.toString(),
  //           transactionHash: entity.transactionHash,
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       console.error(
  //         `Failed to store transfer: ${response.status} - ${errorText}`
  //       );
  //     } else if (response.status === 200) {
  //       console.log("Transfer already exists");
  //     } else if (response.status === 201) {
  //       // here put the telegram notification
  //       const message = "New Listing!!!";
  //       await sendTelegramNotification(message);

  //       console.log("Transfer stored successfully");
  //     }
  //   } catch (error) {
  //     console.error("Failed to track transfer:", error);
  //   }
}
