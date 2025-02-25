import React from "react";
import Image from "next/image";

interface TokenProps {
  name: string;
  symbol: string;
  image: string;
  trackedSince?: string;
  trackingTime?: string;
  signalsGenerated?: number;
}

const Token: React.FC<TokenProps> = ({
  name = "Token Name",
  symbol = "TKN",
  image = "",
  trackedSince,
  signalsGenerated,
}) => {
  const calculateTrackingTime = () => {
    if (!trackedSince) return "N/A";

    const start = new Date(trackedSince);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return `${diffDays} days`;
  };

  return (
    <div className="bg-white text-black rounded-lg border shadow-md p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
            <Image
              src={image}
              alt={`${symbol} token`}
              className="w-full h-full object-cover"
              width={32}
              height={32}
              priority={false}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-black">{name}</span>
            <span className="text-sm text-black">{symbol}</span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-black">Tracked Since</span>
          <span className="font-medium">{trackedSince}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-black">Tracking Time</span>
          <span className="font-medium">{calculateTrackingTime()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-black">Signals Generated</span>
          <span className="font-medium">{signalsGenerated}</span>
        </div>
      </div>
    </div>
  );
};

export default Token;
