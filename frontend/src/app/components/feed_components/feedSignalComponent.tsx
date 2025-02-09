import React from 'react';

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
  return (
    <div className="pt-6 p-2 flex items-start gap-4 w-[600px]">
      <img src="/gorillionaire.jpg" alt="Profile" className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">Gorillionaire</span>
            <span className="text-yellow-500">🦍</span>
          </div>
          <span className="text-xs text-gray-500">AI Analysis</span>
        </div>
        <p className="text-gray-600 mt-1">Market Signal</p>
        <div className="text-gray-700 mt-2">
          <div className="flex justify-between">
            <span>Signal: <strong>{signal.signal}</strong></span>
            <span>Confidence: <strong>{signal.confidence}%</strong></span>
          </div>
          <div className="mt-2 text-sm space-y-1">
            <p>Volatility (1h): {signal.metrics.volatility1h.toFixed(4)}</p>
            <p>Volatility (24h): {signal.metrics.volatility24h.toFixed(4)}</p>
            <p>Volume Trend: {signal.metrics.volumeTrend}</p>
            <p>Avg 1h Change: {signal.metrics.avg1hChange.toFixed(2)}%</p>
            <p>Avg 24h Change: {signal.metrics.avg24hChange.toFixed(2)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedSignalComponent;