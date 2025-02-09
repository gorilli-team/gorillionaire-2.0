import React from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface TokenChartProps {
  data: number[];
  title: string;
  type?: 'percentage' | 'volume';
}

const TokenChart: React.FC<TokenChartProps> = ({ data, title, type = 'percentage' }) => {
  
  const chartData = data.map((value, index) => ({
    day: `Day ${index + 1}`,
    value: value
  }));

  const getGradientColors = () => {
    if (type === 'percentage') {
      return {
        positiveColor: "#16a34a",
        neutralColor: "#facc15",
        negativeColor: "#dc2626"
      };
    }
    return {
      positiveColor: "#4ade80",
      neutralColor: "#fbbf24",
      negativeColor: "#f87171"
    };
  };

  const { positiveColor, neutralColor, negativeColor } = getGradientColors();

  return (
    <div className="p-4 bg-gray-900 text-white shadow-md w-[48%] mb-4">
      <h3 className="text-lg font-semibold text-center">🔥 {title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="tokenChartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={positiveColor} stopOpacity={0.8} />
              <stop offset="50%" stopColor={neutralColor} stopOpacity={0.8} />
              <stop offset="100%" stopColor={negativeColor} stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <XAxis dataKey="day" stroke="#ffffff" padding={{ left: 20, right: 20 }} />
          <YAxis stroke="#ffffff" padding={{ top: 20, bottom: 20 }} />
          <Tooltip 
            formatter={(value) => [
              type === 'percentage' ? `${value}%` : value.toLocaleString(), 
              'Value'
            ]}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="none" 
            fill="url(#tokenChartGradient)" 
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 text-sm text-gray-300 text-center">
        {type === 'percentage' ? (
          <>
            <p><span className="text-red-400">🔴 Negative</span> → Value &lt; 0</p>
            <p><span className="text-yellow-400">🟡 Neutral</span> → Value around 0</p>
            <p><span className="text-green-400">🟢 Positive</span> → Value &gt; 0</p>
          </>
        ) : (
          <p>Trend of the metric over time</p>
        )}
      </div>
    </div>
  );
};

export default TokenChart;