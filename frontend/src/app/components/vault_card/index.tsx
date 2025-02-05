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
    <div
      onClick={onCardClick}
      className="cursor-pointer bg-white shadow-md rounded-2xl p-4 mx-auto flex-col justify-center w-full"
    >
      <div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="flex items-center justify-center bg-gray-300 p-2 rounded-lg w-1/3">
          <span className="text-xs text-gray-600">30D APY:</span>
          <span className="font-medium text-gray-800">{apy}</span>
        </div>
        <div className="flex items-center justify-center bg-gray-300 p-2 rounded-lg w-1/3">
          <span className="text-xs text-gray-600">TVL:</span>
          <span className="font-medium text-gray-800">{tvl}</span>
        </div>
        <div className="flex items-center justify-center bg-gray-300 p-2 rounded-lg w-1/3">
          <img
            src={chainImage}
            alt={chainName}
            className="h-4 w-4 rounded-full mr-2"
          />
          <span className="text-xs font-medium text-gray-800">{chainName}</span>
        </div>
      </div>
      <div className="flex-shrink-0 mt-4">
        <button
          onClick={onDeposit}
          className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition w-full"
        >
          Deposit
        </button>
      </div>
    </div>
  );
};
