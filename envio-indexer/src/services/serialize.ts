import { EnvioPriceEvent, EnvioNewPair } from '../proto/v1/envio/envio';

export function serializeEnvioPriceEvent(event: EnvioPriceEvent): Uint8Array {
  return EnvioPriceEvent.encode(event).finish();
}

export function serializeEnvioNewPair(event: EnvioNewPair): Uint8Array {
  return EnvioNewPair.encode(event).finish();
}

