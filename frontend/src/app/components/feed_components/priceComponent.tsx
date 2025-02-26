import React from "react";
import Image from "next/image";

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
      <Image
        src="/gorillionaire.jpg"
        alt="Profile"
        width={40}
        height={40}
        className="rounded-full"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">Gorillionaire</span>
            <span className="text-yellow-500">🦍</span>
          </div>
          <span className="text-xs text-gray-500">
            {new Date(price.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="cursor-pointer bg-white shadow-md mt-4 rounded-2xl p-4 mx-auto flex-col justify-center text-[14px]">
          <div className="text-gray-800">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-bold text-lg">
                  Price:{" "}
                  <span className="text-blue-600">
                    ${price.price.toFixed(4)}
                  </span>
                </p>
                <p className="text-sm">
                  Market Cap:{" "}
                  <span className="font-medium">
                    ${(price.marketCap / 1_000_000).toFixed(2)}M
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm">
                  24h Volume:{" "}
                  <span className="font-medium">
                    ${(price.volume24h / 1_000_000).toFixed(2)}M
                  </span>
                </p>
                <p
                  className={`text-sm font-medium ${
                    price.volumeChange24h >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  Volume Change: {price.volumeChange24h.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <p
                className={`text-sm font-medium ${
                  price.percentChange1h >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                1h Change: {price.percentChange1h.toFixed(2)}%
              </p>
              <p
                className={`text-sm font-medium ${
                  price.percentChange24h >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                24h Change: {price.percentChange24h.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceComponent;
