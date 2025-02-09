import React from 'react';

interface PriceProps {
  price: {
    price: number;
    marketCap: number;
    volume24h: number;
    volumeChange24h: number;
    percentChange1h: number;
    percentChange24h: number;
    timestamp: string;
  };
}

const PriceComponent: React.FC<PriceProps> = ({ price }) => {
  return (
    <div className="pt-6 p-2 flex items-start gap-4 w-[600px]">
      <img src="/gorillionaire.jpg" alt="Profile" className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">Gorillionaire</span>
            <span className="text-yellow-500">🦍</span>
          </div>
          <span className="text-xs text-gray-500">
            {new Date(price.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        <div className="text-gray-700 mt-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p>Price: ${price.price.toFixed(4)}</p>
              <p>Market Cap: ${(price.marketCap / 1_000_000).toFixed(2)}M</p>
            </div>
            <div>
              <p>24h Volume: ${(price.volume24h / 1_000_000).toFixed(2)}M</p>
              <p className={`${price.volumeChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Volume Change: {price.volumeChange24h.toFixed(2)}%
              </p>
            </div>
          </div>
          <div className="mt-2 text-sm space-y-1">
            <p className={`${price.percentChange1h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              1h Change: {price.percentChange1h.toFixed(2)}%
            </p>
            <p className={`${price.percentChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              24h Change: {price.percentChange24h.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceComponent;