export interface TokenData {
  id: number;
  name: string;
  symbol: string;
  price: string;
  volume: string;
  image: string;
  holders: number;
  age: string;
  address: string;
  isActive: boolean;
  supply: string;
  trackedSince: string;
  trackingTime: string;
  signalsGenerated: number;
}

export const trackedTokens: TokenData[] = [
  {
    id: 1,
    name: "Wrapped Monad",
    symbol: "MON",
    supply: "93,415,274,755",
    holders: 103039,
    age: "17 days ago",
    address: "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701",
    image:
      "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/I_t8rg_V_400x400.jpg/public",
    isActive: false,
    price: "$0.50",
    volume: "$1.2M",
    trackedSince: "Feb 20, 2025",
    trackingTime: "5 days",
    signalsGenerated: 127,
  },
  {
    id: 2,
    name: "Tether USD",
    symbol: "USDT",
    supply: "27,937",
    holders: 229794,
    age: "28 days 6 hrs ago",
    address: "0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D",
    image: "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/images.png/public",
    isActive: false,
    price: "$0.50",
    volume: "$1.2M",
    trackedSince: "Feb 25, 2025",
    trackingTime: "2 days",
    signalsGenerated: 84,
  },
  {
    id: 3,
    name: "USD Coin",
    symbol: "USDC",
    supply: "87,831",
    holders: 1042219,
    age: "28 days 6 hrs ago",
    address: "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea",
    image: "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/usdc.png/public",
    isActive: false,
    price: "$0.50",
    volume: "$1.2M",
    trackedSince: "Mar 1, 2025",
    trackingTime: "1 day",
    signalsGenerated: 56,
  },
  {
    id: 11,
    name: "Molandak",
    symbol: "DAK",
    supply: "296,997",
    holders: 603708,
    age: "10 days 20 hrs ago",
    address: "0x0F0B...c714",
    image:
      "https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/27759359-9374-4995-341c-b2636a432800/public",
    isActive: false,
    price: "$0.50",
    volume: "$1.2M",
    trackedSince: "Feb 22, 2025",
    trackingTime: "4 days",
    signalsGenerated: 112,
  },
  {
    id: 12,
    name: "Moyaki",
    symbol: "YAKI",
    supply: "288,018",
    holders: 536061,
    age: "10 days 20 hrs ago",
    address: "0xfe14...0C50",
    image:
      "https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/6679b698-a845-412b-504b-23463a3e1900/public",
    isActive: false,
    price: "$0.50",
    volume: "$1.2M",
    trackedSince: "Feb 24, 2025",
    trackingTime: "3 days",
    signalsGenerated: 95,
  },
  {
    id: 13,
    name: "Chog",
    symbol: "CHOG",
    supply: "275,880",
    holders: 565297,
    age: "10 days 20 hrs ago",
    address: "0xE059...4E6B",
    image:
      "https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/5d1206c2-042c-4edc-9f8b-dcef2e9e8f00/public",
    isActive: false,
    price: "$0.50",
    volume: "$1.2M",
    trackedSince: "Feb 26, 2025",
    trackingTime: "2 days",
    signalsGenerated: 72,
  },
];
