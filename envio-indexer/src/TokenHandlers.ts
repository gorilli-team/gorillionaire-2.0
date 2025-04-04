/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import { Token, TokenAggregateSwaps, TokenHourlySnapshot } from "generated";

const HOUR_IN_S = 60 * 60;

Token.Transfer.handler(async ({ event, context }) => {
  const hourTimestamp = Math.floor(event.block.timestamp / HOUR_IN_S);
  const snapshotId = `${event.srcAddress}-${hourTimestamp}`;
  const previousSnapshot = await context.TokenHourlySnapshot.get(snapshotId);

  let snapshot: TokenHourlySnapshot = {
    id: snapshotId,
    tokenAddress: event.srcAddress,
    transferCount: (previousSnapshot?.transferCount ?? 0) + 1,
    lastUpdatedAt: event.block.timestamp,
  };

  context.TokenHourlySnapshot.set(snapshot);

  const tokenSwapsId = `${event.srcAddress}-swaps`;
  const previousTokenInfo = await context.TokenAggregateSwaps.get(tokenSwapsId);
  const previousAvg = previousTokenInfo?.avgAmount ?? BigInt(0);
  const previousCount = previousTokenInfo?.transferCount ?? 0;

  let tokenSwaps: TokenAggregateSwaps = {
    id: tokenSwapsId,
    tokenAddress: event.srcAddress,
    transferCount: previousCount + 1,
    avgAmount:
      (previousAvg * BigInt(previousCount) + event.params.value) /
      BigInt(previousCount + 1),
    lastUpdatedAt: event.block.timestamp,
  };

  context.TokenAggregateSwaps.set(tokenSwaps);
});
