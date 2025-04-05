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
/** EnvioNewPair contains the new pair details */
export interface EnvioNewPair {
    Token0Address: string;
    Token1Address: string;
}
export declare const EnvioPriceEvent: {
    encode(message: EnvioPriceEvent, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): EnvioPriceEvent;
    fromJSON(object: any): EnvioPriceEvent;
    toJSON(message: EnvioPriceEvent): unknown;
    create(base?: DeepPartial<EnvioPriceEvent>): EnvioPriceEvent;
    fromPartial(object: DeepPartial<EnvioPriceEvent>): EnvioPriceEvent;
};
export declare const EnvioNewPair: {
    encode(message: EnvioNewPair, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): EnvioNewPair;
    fromJSON(object: any): EnvioNewPair;
    toJSON(message: EnvioNewPair): unknown;
    create(base?: DeepPartial<EnvioNewPair>): EnvioNewPair;
    fromPartial(object: DeepPartial<EnvioNewPair>): EnvioNewPair;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
