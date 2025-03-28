// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.181.2
//   protoc               v3.20.3
// source: v1/envio/envio.proto

/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "proto";

/** EnvioPriceEvent contains the price event details */
export interface EnvioPriceEvent {
  FromAddress: string;
  ToAddress: string;
  Amount: string;
  BlockNumber: string;
  BlockTimestamp: string;
  TransactionHash: string;
  TokenSymbol: string;
  TokenName: string;
  TokenAddress: string;
  TokenDecimals: number;
  ThisHourTransfers: number;
}

function createBaseEnvioPriceEvent(): EnvioPriceEvent {
  return {
    FromAddress: "",
    ToAddress: "",
    Amount: "",
    BlockNumber: "",
    BlockTimestamp: "",
    TransactionHash: "",
    TokenSymbol: "",
    TokenName: "",
    TokenAddress: "",
    TokenDecimals: 0,
    ThisHourTransfers: 0,
  };
}

export const EnvioPriceEvent = {
  encode(message: EnvioPriceEvent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.FromAddress !== "") {
      writer.uint32(10).string(message.FromAddress);
    }
    if (message.ToAddress !== "") {
      writer.uint32(18).string(message.ToAddress);
    }
    if (message.Amount !== "") {
      writer.uint32(26).string(message.Amount);
    }
    if (message.BlockNumber !== "") {
      writer.uint32(34).string(message.BlockNumber);
    }
    if (message.BlockTimestamp !== "") {
      writer.uint32(42).string(message.BlockTimestamp);
    }
    if (message.TransactionHash !== "") {
      writer.uint32(50).string(message.TransactionHash);
    }
    if (message.TokenSymbol !== "") {
      writer.uint32(58).string(message.TokenSymbol);
    }
    if (message.TokenName !== "") {
      writer.uint32(66).string(message.TokenName);
    }
    if (message.TokenAddress !== "") {
      writer.uint32(74).string(message.TokenAddress);
    }
    if (message.TokenDecimals !== 0) {
      writer.uint32(80).int32(message.TokenDecimals);
    }
    if (message.ThisHourTransfers !== 0) {
      writer.uint32(88).int32(message.ThisHourTransfers);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EnvioPriceEvent {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEnvioPriceEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.FromAddress = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.ToAddress = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.Amount = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.BlockNumber = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.BlockTimestamp = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.TransactionHash = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.TokenSymbol = reader.string();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.TokenName = reader.string();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.TokenAddress = reader.string();
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.TokenDecimals = reader.int32();
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.ThisHourTransfers = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EnvioPriceEvent {
    return {
      FromAddress: isSet(object.FromAddress) ? globalThis.String(object.FromAddress) : "",
      ToAddress: isSet(object.ToAddress) ? globalThis.String(object.ToAddress) : "",
      Amount: isSet(object.Amount) ? globalThis.String(object.Amount) : "",
      BlockNumber: isSet(object.BlockNumber) ? globalThis.String(object.BlockNumber) : "",
      BlockTimestamp: isSet(object.BlockTimestamp) ? globalThis.String(object.BlockTimestamp) : "",
      TransactionHash: isSet(object.TransactionHash) ? globalThis.String(object.TransactionHash) : "",
      TokenSymbol: isSet(object.TokenSymbol) ? globalThis.String(object.TokenSymbol) : "",
      TokenName: isSet(object.TokenName) ? globalThis.String(object.TokenName) : "",
      TokenAddress: isSet(object.TokenAddress) ? globalThis.String(object.TokenAddress) : "",
      TokenDecimals: isSet(object.TokenDecimals) ? globalThis.Number(object.TokenDecimals) : 0,
      ThisHourTransfers: isSet(object.ThisHourTransfers) ? globalThis.Number(object.ThisHourTransfers) : 0,
    };
  },

  toJSON(message: EnvioPriceEvent): unknown {
    const obj: any = {};
    if (message.FromAddress !== "") {
      obj.FromAddress = message.FromAddress;
    }
    if (message.ToAddress !== "") {
      obj.ToAddress = message.ToAddress;
    }
    if (message.Amount !== "") {
      obj.Amount = message.Amount;
    }
    if (message.BlockNumber !== "") {
      obj.BlockNumber = message.BlockNumber;
    }
    if (message.BlockTimestamp !== "") {
      obj.BlockTimestamp = message.BlockTimestamp;
    }
    if (message.TransactionHash !== "") {
      obj.TransactionHash = message.TransactionHash;
    }
    if (message.TokenSymbol !== "") {
      obj.TokenSymbol = message.TokenSymbol;
    }
    if (message.TokenName !== "") {
      obj.TokenName = message.TokenName;
    }
    if (message.TokenAddress !== "") {
      obj.TokenAddress = message.TokenAddress;
    }
    if (message.TokenDecimals !== 0) {
      obj.TokenDecimals = Math.round(message.TokenDecimals);
    }
    if (message.ThisHourTransfers !== 0) {
      obj.ThisHourTransfers = Math.round(message.ThisHourTransfers);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EnvioPriceEvent>, I>>(base?: I): EnvioPriceEvent {
    return EnvioPriceEvent.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EnvioPriceEvent>, I>>(object: I): EnvioPriceEvent {
    const message = createBaseEnvioPriceEvent();
    message.FromAddress = object.FromAddress ?? "";
    message.ToAddress = object.ToAddress ?? "";
    message.Amount = object.Amount ?? "";
    message.BlockNumber = object.BlockNumber ?? "";
    message.BlockTimestamp = object.BlockTimestamp ?? "";
    message.TransactionHash = object.TransactionHash ?? "";
    message.TokenSymbol = object.TokenSymbol ?? "";
    message.TokenName = object.TokenName ?? "";
    message.TokenAddress = object.TokenAddress ?? "";
    message.TokenDecimals = object.TokenDecimals ?? 0;
    message.ThisHourTransfers = object.ThisHourTransfers ?? 0;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
