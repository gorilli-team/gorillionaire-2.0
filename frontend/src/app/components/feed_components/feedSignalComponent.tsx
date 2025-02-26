import React from "react";
import Image from "next/image";

interface FeedSignalProps {
  signal: {
    signal: string;
    confidence: number;
    metrics: {
      volatility1h: number;
      volatility24h: number;
      volumeTrend: string;
      avg1hChange: number;
      avg24hChange: number;
    };
  };
}

const FeedSignalComponent: React.FC<FeedSignalProps> = ({ signal }) => {
  // Add check for missing metrics properties
  const hasAllMetrics =
    signal.metrics &&
    typeof signal.metrics.volatility1h === "number" &&
    typeof signal.metrics.volatility24h === "number" &&
    typeof signal.metrics.volumeTrend === "string" &&
    typeof signal.metrics.avg1hChange === "number" &&
    typeof signal.metrics.avg24hChange === "number";

  if (!hasAllMetrics) {
    return null;
  }

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
          <span className="text-xs text-gray-500">AI Analysis</span>
        </div>
        <div className="cursor-pointer bg-white shadow-md mt-4 rounded-2xl p-4 mx-auto flex-col justify-center text-[14px]">
          <p className="text-gray-600 font-medium mb-2">Market Signal</p>
          <div className="text-gray-800">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold">
                Signal: <span className="text-blue-600">{signal.signal}</span>
              </span>
              <span className="text-lg font-bold">
                Confidence:{" "}
                <span className="text-green-600">{signal.confidence}%</span>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>
                Volatility (1h):{" "}
                <span className="font-medium">
                  {signal.metrics?.volatility1h.toFixed(4)}
                </span>
              </p>
              <p>
                Volatility (24h):{" "}
                <span className="font-medium">
                  {signal.metrics?.volatility24h.toFixed(4)}
                </span>
              </p>
              <p>
                Volume Trend:{" "}
                <span className="font-medium text-purple-600">
                  {signal.metrics?.volumeTrend}
                </span>
              </p>
              <p>
                Avg 1h Change:{" "}
                <span
                  className={`font-medium ${
                    signal.metrics?.avg1hChange >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {signal.metrics?.avg1hChange.toFixed(2)}%
                </span>
              </p>
              <p>
                Avg 24h Change:{" "}
                <span
                  className={`font-medium ${
                    signal.metrics?.avg24hChange >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {signal.metrics?.avg24hChange.toFixed(2)}%
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedSignalComponent;
