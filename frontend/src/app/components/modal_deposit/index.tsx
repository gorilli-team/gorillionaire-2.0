import React, { useState } from "react";
import Image from "next/image";

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
  const [depositAmount, setDepositAmount] = useState<string>("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimals
    const value = e.target.value.replace(/[^0-9.]/g, "");
    // Prevent multiple decimal points
    if ((value.match(/\./g) || []).length <= 1) {
      setDepositAmount(value);
    }
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

  const isValidAmount =
    depositAmount !== "" &&
    !isNaN(Number(depositAmount)) &&
    Number(depositAmount) > 0;
  const displayAmount = depositAmount === "" ? "0" : depositAmount;
  const amountInDecimals = isValidAmount
    ? BigInt(
        displayAmount
          .replace(".", "")
          .padEnd(
            displayAmount.includes(".")
              ? displayAmount.length + 5
              : displayAmount.length + 6,
            "0"
          )
      )
    : BigInt(0);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 pt-4 rounded-lg shadow-lg w-96 relative">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold">Deposit USDC</div>
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
                value={depositAmount}
                onChange={handleAmountChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter amount"
                pattern="[0-9]*[.]?[0-9]*"
              />
              <div className="text-sm text-gray-500 mt-1">
                {isValidAmount &&
                  `Amount in wei: ${amountInDecimals.toString()}`}
              </div>
            </div>

            <button
              onClick={handleDepositSubmit}
              disabled={!isValidAmount}
              className={`px-4 py-2 w-full rounded-lg ${
                isValidAmount
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {amountInDecimals > allowance ? "Approve" : "Deposit"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalDeposit;
