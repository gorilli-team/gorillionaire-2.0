import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Image from "next/image";

interface ModalWithdrawProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (amount: number) => void;
  maxAmount?: bigint;
}

export const ModalWithdraw: React.FC<ModalWithdrawProps> = ({
  isOpen,
  onClose,
  onWithdraw,
  maxAmount,
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [maxAmountInUSDC, setMaxAmountInUSDC] = useState<string>("0");

  useEffect(() => {
    if (maxAmount) {
      const inUSDC = ethers.formatUnits(maxAmount, 6);
      setMaxAmountInUSDC(inUSDC);
    }
  }, [maxAmount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    if ((value.match(/\./g) || []).length <= 1) {
      setWithdrawAmount(value);
    }
  };

  const handleWithdrawSubmit = () => {
    if (withdrawAmount && !isNaN(Number(withdrawAmount))) {
      onWithdraw(Number(withdrawAmount));
      setWithdrawAmount("");
      onClose();
    } else {
      alert("Please enter a valid amount");
    }
  };

  const isValidAmount = () => {
    if (
      !withdrawAmount ||
      isNaN(Number(withdrawAmount)) ||
      Number(withdrawAmount) <= 0
    ) {
      return false;
    }

    if (maxAmount) {
      const amountInWei = ethers.parseUnits(withdrawAmount, 6);
      return amountInWei <= maxAmount;
    }

    return true;
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 pt-4 rounded-lg shadow-lg w-96 relative">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold">Withdraw USDC</div>
              <button
                onClick={onClose}
                className="text-xl text-gray-600 hover:text-gray-800"
              >
                ×
              </button>
            </div>

            <div className="flex items-center mb-4">
              <span className="mr-2 text-sm">Token:</span>
              <Image
                src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=040"
                alt="USDC"
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <span className="ml-2">USDC</span>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={withdrawAmount}
                onChange={handleAmountChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter amount"
                pattern="[0-9]*[.]?[0-9]*"
              />
              {maxAmount && (
                <div className="text-sm text-gray-500 mt-1">
                  Max amount: {maxAmountInUSDC} USDC
                </div>
              )}
            </div>

            <button
              onClick={handleWithdrawSubmit}
              disabled={!isValidAmount()}
              className={`px-4 py-2 w-full rounded-lg ${
                isValidAmount()
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Withdraw
            </button>
          </div>
        </div>
      )}
    </>
  );
};
