import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import Image from 'next/image';

interface Token {
  name: string;
  value: number;
  color: string;
  logo: string;
}

interface VaultStrategyProps {
  tokens: Token[];
}

const VaultStrategy: React.FC<VaultStrategyProps> = ({ tokens }) => {
  const total = tokens.reduce((sum, token) => sum + token.value, 0);

  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-lg">
      <div className="w-1/3">
        {tokens.map((token) => (
          <div key={token.name} className="flex justify-between items-center p-2 bg-white border border-gray-200 rounded-lg mb-2">
            <div className="flex items-center">
              <Image src={token.logo} alt={token.name} className="w-6 h-6 mr-2" />
              <span>{token.name}</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: token.color }}></span>
              <span className="font-bold">${token.value.toLocaleString()}</span>
              <span className="ml-2 text-gray-500">({((token.value / total) * 100).toFixed(2)}%)</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <PieChart width={200} height={200}>
          <Pie
            data={tokens}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}

            fill="#8884d8"
          >
            {tokens.map((token, index) => (
              <Cell key={`cell-${index}`} fill={token.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number | string, name: string) => `${name}`}
          />
        </PieChart>
      </div>

      <div className="w-1/3 flex justify-center items-center">
        <div className="text-lg font-bold text-gray-700">${total.toLocaleString()}</div>
      </div>
    </div>
  );
};

export default VaultStrategy;
