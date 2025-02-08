import React, { useState } from "react";
import Image from 'next/image';

interface ModalDepositProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => void;
  allowance: bigint;
}

export const ModalDeposit: React.FC<ModalDepositProps> = ({
  isOpen,
  onClose,
  onDeposit,
  allowance,
}) => {
  const [depositAmount, setDepositAmount] = useState<number | string>("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepositAmount(e.target.value);
  };

  const handleDepositSubmit = () => {
    if (depositAmount && !isNaN(Number(depositAmount))) {
      onDeposit(Number(depositAmount));
      setDepositAmount("");
      onClose();
    } else {
      alert("Please enter a valid amount");
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 pt-4 rounded-lg shadow-lg w-96 relative">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold">Deposit on Vault</div>
              <button
                onClick={onClose}
                className="text-xl text-gray-600 hover:text-gray-800"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="flex items-center mb-4">
              <span className="mr-2 text-sm">Token:</span>
              <Image
                src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=040"
                alt="ETH"
                className="h-6 w-6"
              />
              <span className="ml-2">USDC</span>
            </div>
            <div className="mb-4">
              <input
                type="number"
                value={depositAmount}
                onChange={handleAmountChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <button
                onClick={handleDepositSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg w-full"
              >
                {BigInt(Number(depositAmount) * Math.pow(10, 6) > allowance)
                  ? "Approve"
                  : "Deposit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
