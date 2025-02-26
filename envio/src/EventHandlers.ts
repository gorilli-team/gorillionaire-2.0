/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import { Moyaki, Moyaki_Approval, Moyaki_Transfer } from "generated";

Moyaki.Approval.handler(async ({ event, context }) => {
  // const entity: Moyaki_Approval = {
  //   id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
  //   owner: event.params.owner,
  //   spender: event.params.spender,
  //   value: event.params.value,
  // };
  // context.Moyaki_Approval.set(entity);
});

Moyaki.Transfer.handler(async ({ event, context }) => {
  if (event.params.value > 10000000000000000000000000) {
    const entity: Moyaki_Transfer = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      from: event.params.from,
      to: event.params.to,
      value: event.params.value,
    };

    context.Moyaki_Transfer.set(entity);
  }
});
