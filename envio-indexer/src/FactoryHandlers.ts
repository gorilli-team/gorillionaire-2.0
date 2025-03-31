import { UniswapPoolFactory } from "generated";

UniswapPoolFactory.PoolCreated.contractRegister(async ({ event, context }) => {
  const token0Address = event.params.token0;
  const token1Address = event.params.token1;

  context.addToken(token0Address);
  context.addToken(token1Address);
});
