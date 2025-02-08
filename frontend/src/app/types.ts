export interface Transaction {
  hash: string;
  method: "Deposit" | "Withdraw";
  blockNumber: string;
  timeStamp: string;
  to: string;
  from: string;
  // amount: string;
  // txnFee: string;
}


export interface TradingViewWidgetOptions {
  autosize: boolean;
  symbol: string;
  interval: string;
  container_id: string;
  theme: string;
  style: string;
  locale: string;
  toolbar_bg: string;
  hide_side_toolbar: boolean;
  allow_symbol_change: boolean;
}

declare global {
  interface Window {
    TradingView: {
      widget: (options: TradingViewWidgetOptions) => void;
    };
  }
}