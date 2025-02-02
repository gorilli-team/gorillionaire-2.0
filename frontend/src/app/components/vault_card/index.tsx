import React from "react";

interface CardProps {
  title: string;
  apy: string;
  tvl: string;
  chainName: string;
  chainImage: string;
  onDeposit: () => void;
  onWithdraw: () => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  apy,
  tvl,
  chainName,
  chainImage,
  onDeposit,
  onWithdraw,
}) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 max-w-sm mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600">30D APY:</span>
        <span className="font-medium text-gray-800">{apy}</span>
      </div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600">TVL:</span>
        <span className="font-medium text-gray-800">{tvl}</span>
      </div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600">Chain:</span>
        <div className="flex items-center">
          <img
            src={chainImage}
            alt={`${chainName} Chain`}
            className="w-5 h-5 rounded-full mr-2"
          />
          <span className="font-medium text-gray-800">{chainName}</span>
        </div>
      </div>
      <div className="flex justify-between mt-6 gap-4">
        <button
          onClick={onDeposit}
          className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition"
        >
          Deposit
        </button>
        <button
          onClick={onWithdraw}
          className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
        >
          Withdraw
        </button>
      </div>
    </div>
  );
};
