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
    id: 11,
    name: "Molandak",
    symbol: "DAK",
    supply: "296,997",
    holders: 603708,
    age: "10 days 20 hrs ago",
    address: "0x0F0BDEbF0F83cD1EE3974779Bcb7315f9808c714",
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
    address: "0xfe140e1dCe99Be9F4F15d657CD9b7BF622270C50",
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
    address: "0xE0590015A873bF326bd645c3E1266d4db41C4E6B",
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
