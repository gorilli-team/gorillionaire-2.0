import { UniswapPoolFactory } from "generated";
import { EnvioNewPair } from './proto/v1/envio/envio';
import { serializeEnvioNewPair } from "./services/serialize";
import * as nats from "./services/nats";
UniswapPoolFactory.PoolCreated.contractRegister(
  async ({ event, context }) => {
    const token0Address = event.params.token0;
    const token1Address = event.params.token1;
    context.addToken(token0Address);
    context.addToken(token1Address);
    const newPair: EnvioNewPair = {
      Token0Address: token0Address,
      Token1Address: token1Address,
    };
    const serializedNewPair = serializeEnvioNewPair(newPair);
    nats.publish(nats.NATS_NEWPAIR_SUBJECT, serializedNewPair);
    console.log("Published new pair", serializedNewPair);
  },
  {
    preRegisterDynamicContracts: true, // Enable pre-registration for better performance
  }
);
