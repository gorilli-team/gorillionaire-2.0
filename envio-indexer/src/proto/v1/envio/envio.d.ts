import _m0 from "protobufjs/minimal";
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
export interface EnvioPriceEventBatch {
    events: EnvioPriceEvent[];
}
/** EnvioNewPair contains the new pair details */
export interface EnvioNewPair {
    Token0Address: string;
    Token1Address: string;
    ChainName: string;
}
export interface EnvioNewPairBatch {
    events: EnvioNewPair[];
}
export declare const EnvioPriceEvent: {
    encode(message: EnvioPriceEvent, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): EnvioPriceEvent;
    fromJSON(object: any): EnvioPriceEvent;
    toJSON(message: EnvioPriceEvent): unknown;
    create(base?: DeepPartial<EnvioPriceEvent>): EnvioPriceEvent;
    fromPartial(object: DeepPartial<EnvioPriceEvent>): EnvioPriceEvent;
};
export declare const EnvioPriceEventBatch: {
    encode(message: EnvioPriceEventBatch, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): EnvioPriceEventBatch;
    fromJSON(object: any): EnvioPriceEventBatch;
    toJSON(message: EnvioPriceEventBatch): unknown;
    create(base?: DeepPartial<EnvioPriceEventBatch>): EnvioPriceEventBatch;
    fromPartial(object: DeepPartial<EnvioPriceEventBatch>): EnvioPriceEventBatch;
};
export declare const EnvioNewPair: {
    encode(message: EnvioNewPair, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): EnvioNewPair;
    fromJSON(object: any): EnvioNewPair;
    toJSON(message: EnvioNewPair): unknown;
    create(base?: DeepPartial<EnvioNewPair>): EnvioNewPair;
    fromPartial(object: DeepPartial<EnvioNewPair>): EnvioNewPair;
};
export declare const EnvioNewPairBatch: {
    encode(message: EnvioNewPairBatch, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): EnvioNewPairBatch;
    fromJSON(object: any): EnvioNewPairBatch;
    toJSON(message: EnvioNewPairBatch): unknown;
    create(base?: DeepPartial<EnvioNewPairBatch>): EnvioNewPairBatch;
    fromPartial(object: DeepPartial<EnvioNewPairBatch>): EnvioNewPairBatch;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
