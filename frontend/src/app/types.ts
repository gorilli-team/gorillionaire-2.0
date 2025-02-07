export interface Transaction {
    hash: string;
    method: "Deposit" | "Withdraw";
    block: number;
    age: number;
    from: string;
    amount: string;
    txnFee: string;
}

declare global {
    interface Window {
      TradingView: any;
    }
  }