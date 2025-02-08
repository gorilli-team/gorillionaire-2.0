import React from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface SentimentChartProps {
  data: { date: string; sentiment: number }[];
}

const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
  return (
    <div className="p-4 bg-gray-900 text-white shadow-md">
      <h3 className="text-lg font-semibold text-center">🔥 Sentiment Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16a34a" stopOpacity={0.8} />
              <stop offset="50%" stopColor="#facc15" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="#ffffff" padding={{ left: 20, right: 20 }} />
          <YAxis stroke="#ffffff" padding={{ top: 20, bottom: 20 }} />
          <Area 
            type="monotone" 
            dataKey="sentiment" 
            stroke="none" 
            fill="url(#colorSentiment)" 
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 text-sm text-gray-300 text-center">
        <p><span className="text-red-400">🟥 SELL! ("Rug incoming!")</span> → Sentiment &lt; -10</p>
        <p><span className="text-yellow-400">🟡 HOLD? ("Wen Lambo?")</span> → Sentiment -10 to 10</p>
        <p><span className="text-green-400">🟢 BUY!! ("To the moon! 🚀")</span> → Sentiment &gt; 10</p>
      </div>
    </div>
  );
};

export default SentimentChart;
