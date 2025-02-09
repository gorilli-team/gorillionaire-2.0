import React from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface TokenData {
  value: string;
  key: string;
  _id: string;
  agentId: string;
  createdAt: string;
  expiresAt: string;
}

interface TokenChartProps {
  data: TokenData;
  title: string;
  type?: 'percentage' | 'volume';
}

const TokenChart: React.FC<TokenChartProps> = ({ data, title, type = 'percentage' }) => {
  const parsedData: { value: number[] } = JSON.parse(data.value);
  
  const chartData = parsedData.value.map((value, index) => ({
    time: `T${index + 1}`,
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

  if (!parsedData.value || parsedData.value.length === 0) {
    return <div className="p-4 text-center text-gray-400">No data available</div>;
  }

  return (
    <div className="p-4 bg-gray-900 text-white shadow-md mb-4">
      <h3 className="text-lg font-semibold text-center mb-4">🔥 {title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`tokenChartGradient-${data._id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={positiveColor} stopOpacity={0.8} />
              <stop offset="50%" stopColor={neutralColor} stopOpacity={0.8} />
              <stop offset="100%" stopColor={negativeColor} stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="time" 
            stroke="#ffffff" 
            padding={{ left: 20, right: 20 }}
            axisLine={{ stroke: '#ffffff', strokeWidth: 1 }}
            tick={{ fill: '#ffffff', fontSize: 10 }}
          />
          <YAxis 
            stroke="#ffffff" 
            padding={{ top: 20, bottom: 20 }}
            tickFormatter={(value) => type === 'percentage' ? `${value}%` : value.toLocaleString()}
            axisLine={{ stroke: '#ffffff', strokeWidth: 1 }}
            tick={{ fill: '#ffffff', fontSize: 10 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '0.375rem',
              color: '#ffffff'
            }}
            itemStyle={{ color: '#ffffff' }}
            formatter={(value) => [
              type === 'percentage' ? `${value}%` : value.toLocaleString(),
              'Value'
            ]}
            labelStyle={{ color: '#ffffff' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={`url(#tokenChartGradient-${data._id})`}
            strokeWidth={2}
            fill={`url(#tokenChartGradient-${data._id})`}
            isAnimationActive={true}
            animationDuration={1000}
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
          <>
            <p><span className="text-blue-400">📊 Volume</span> → {parsedData.value[0].toLocaleString()} ({title})</p>
            <p className="text-sm">Latest value shown in chart</p>
          </>
        )}
      </div>
    </div>
  );
};

export default TokenChart;