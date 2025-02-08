import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { getAddress } from 'viem';

const VAULT_ADDRESS = getAddress("0xC6827ce6d60A13a20A86dCac8c9e6D4F84497345");

const vaultAbi = [
  {
    name: 'executeTrade',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'amountIn', type: 'uint256' },
      { name: 'minAmountOut', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
    ],
    outputs: []
  },
  {
    name: 'exitTrade',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'amountIn', type: 'uint256' },
      { name: 'minAmountOut', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
    ],
    outputs: []
  },
  {
    name: 'setAIAgent',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'agent', type: 'address' }
    ],
    outputs: []
  }
] as const;

const isValidAddress = (address: string): boolean => {
  try {
    if (!address) return false;
    getAddress(address);
    return true;
  } catch {
    return false;
  }
};

const isValidAmount = (amount: string): boolean => {
  try {
    if (!amount) return false;
    BigInt(amount);
    return true;
  } catch {
    return false;
  }
};

export default function TradingTest() {
  const { address } = useAccount();
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const [tokenAddress, setTokenAddress] = useState('');
  const [amountIn, setAmountIn] = useState('');
  const [minAmountOut, setMinAmountOut] = useState('');
  const [agentAddress, setAgentAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleError = (error: Error) => {
    if (error.message.includes('user rejected')) {
      setErrorMessage('Transaction rejected by user');
    } else if (error.message.includes('insufficient funds')) {
      setErrorMessage('Insufficient funds for transaction');
    } else if (error.message.includes('execution reverted')) {
      setErrorMessage('Transaction reverted. You might not have the required permissions.');
    } else {
      setErrorMessage(`Error: ${error.message}`);
    }
  };

  const executeContractMethod = async (methodName: 'executeTrade' | 'exitTrade' | 'setAIAgent') => {
    if (!address) {
      setErrorMessage('Wallet not connected');
      return;
    }

    // Reset error message at the start of new execution
    setErrorMessage('');

    const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 minutes

    try {
      if (methodName === 'setAIAgent') {
        if (!isValidAddress(agentAddress)) {
          setErrorMessage('Invalid AI agent address');
          return;
        }

        const checksummedAgentAddress = getAddress(agentAddress);
        writeContract({
          address: VAULT_ADDRESS,
          abi: vaultAbi,
          functionName: methodName,
          args: [checksummedAgentAddress]
        });
      } else {
        // Validazione per executeTrade e exitTrade
        if (!isValidAddress(tokenAddress)) {
          setErrorMessage('Invalid token address');
          return;
        }
        if (!isValidAmount(amountIn) || !isValidAmount(minAmountOut)) {
          setErrorMessage('Invalid amount');
          return;
        }

        const checksummedTokenAddress = getAddress(tokenAddress);
        writeContract({
          address: VAULT_ADDRESS,
          abi: vaultAbi,
          functionName: methodName,
          args: [
            checksummedTokenAddress,
            BigInt(amountIn),
            BigInt(minAmountOut),
            deadline
          ]
        });
      }
    } catch (err) {
      console.error('Contract execution error:', err);
      handleError(err as Error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold mb-4">Trading Test Interface</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Token Address</label>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="0x..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Amount In</label>
          <input
            type="text"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Amount"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Min Amount Out</label>
          <input
            type="text"
            value={minAmountOut}
            onChange={(e) => setMinAmountOut(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Minimum amount to receive"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => executeContractMethod('executeTrade')}
            disabled={isPending}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isPending ? 'Executing...' : 'Execute Trade'}
          </button>
          <button
            onClick={() => executeContractMethod('exitTrade')}
            disabled={isPending}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
          >
            {isPending ? 'Exiting...' : 'Exit Trade'}
          </button>
        </div>

        <div className="border-t pt-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">AI Agent Address</label>
            <input
              type="text"
              value={agentAddress}
              onChange={(e) => setAgentAddress(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="0x..."
            />
          </div>
          <button
            onClick={() => executeContractMethod('setAIAgent')}
            disabled={isPending}
            className="mt-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-purple-300"
          >
            {isPending ? 'Setting...' : 'Set AI Agent'}
          </button>
        </div>

        {hash && (
          <div className="mt-4 p-3 rounded bg-green-100 text-green-700">
            Transaction sent! Hash: {hash}
          </div>
        )}
        
        {errorMessage && (
          <div className="mt-4 p-3 rounded bg-red-100 text-red-700">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}