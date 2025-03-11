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
    <div className="bg-white text-black rounded-lg p-3 sm:p-4 w-full">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
            {image ? (
              <Image
                src={image}
                alt={`${symbol} token`}
                className="w-full h-full object-cover"
                width={32}
                height={32}
                priority={false}
              />
            ) : (
              <span className="text-lg text-white">{symbol.charAt(0)}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-black text-sm sm:text-base">{name}</span>
            <span className="text-xs sm:text-sm text-gray-600">{symbol}</span>
          </div>
        </div>
      </div>
      <div className="space-y-1 sm:space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-600">Tracked Since</span>
          <span className="font-medium text-xs sm:text-sm">{trackedSince || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-600">Tracking Time</span>
          <span className="font-medium text-xs sm:text-sm">{calculateTrackingTime()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-600">Signals Generated</span>
          <span className="font-medium text-xs sm:text-sm">{signalsGenerated || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default Token;