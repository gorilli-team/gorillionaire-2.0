import React from "react";

interface CardProps {
  title: string;
  apy: string;
  tvl: string;
  chainName: string;
  chainImage: string;
  onDeposit: () => void;
  onCardClick: () => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  apy,
  tvl,
  chainName,
  chainImage,
  onDeposit,
  onCardClick
}) => {
  return (
    <div onClick={onCardClick} className="cursor-pointer bg-white shadow-md rounded-2xl p-4 mx-auto flex items-center space-x-6">
      <div className="flex-shrink-0">
        <img
          src={chainImage}
          alt={`${chainName} Chain`}
          className="w-10 h-10 rounded-full"
        />
      </div>
      <div className="flex-grow">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-600">30D APY:</span>
          <span className="font-medium text-gray-800">{apy}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm text-gray-600">TVL:</span>
          <span className="font-medium text-gray-800">{tvl}</span>
        </div>
      </div>
      <div className="flex-shrink-0">
        <button
          onClick={onDeposit}
          className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
        >
          Deposit
        </button>
      </div>
    </div>
  );
};
