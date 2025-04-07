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
export declare const EnvioPriceEvent: {
    encode(message: EnvioPriceEvent, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): EnvioPriceEvent;
    fromJSON(object: any): EnvioPriceEvent;
    toJSON(message: EnvioPriceEvent): unknown;
    create(base?: DeepPartial<EnvioPriceEvent>): EnvioPriceEvent;
    fromPartial(object: DeepPartial<EnvioPriceEvent>): EnvioPriceEvent;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
