import React, { useState } from 'react';
import { ethers, Log } from 'ethers';

// Type definitions for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      chainId?: string;
    };
  }
}

// Minimum ABI required to interact with the contract
const VAULT_ABI = [
  "function setAIAgent(address _newAgent) external",
  "event AIAgentUpdated(address indexed oldAgent, address indexed newAgent)",
  "function executeTrade(address tokenOut, uint256 amountIn, uint256 minAmountOut, uint256 deadline) external",
  "function exitTrade(address tokenIn, uint256 amountIn, uint256 minAmountOut, uint256 deadline) external",
  "event TradeExecuted(address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut)",
  "function totalAssets() external view returns (uint256)",
  "function maxTradingAllocation() external view returns (uint256)"
];

// Base Mainnet Chain ID
const BASE_CHAIN_ID = "0x2105"; // 8453 in hex

const TradingAgentSetup = () => {
  // States for agent setup
  const [vaultAddress, setVaultAddress] = useState('');
  const [agentAddress, setAgentAddress] = useState('');
  const [status, setStatus] = useState('');

  // States for trading operations
  const [tokenAddress, setTokenAddress] = useState('');
  const [amountIn, setAmountIn] = useState('');
  const [minAmountOut, setMinAmountOut] = useState('');
  const [tradeStatus, setTradeStatus] = useState('');
  const [maxTradeAmount, setMaxTradeAmount] = useState('');

  const checkAndSwitchNetwork = async (): Promise<boolean> => {
    if (!window.ethereum) return false;

    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== BASE_CHAIN_ID) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: BASE_CHAIN_ID }],
        });
      }
      return true;
    } catch (error) {
      console.error('Network switch error:', error);
      setStatus('Error switching network. Please make sure you are on Base Mainnet');
      return false;
    }
  };

  const handleSetAgent = async () => {
    try {
      if (!window.ethereum) {
        setStatus('MetaMask is not installed');
        return;
      }

      // Address validation
      if (!ethers.isAddress(vaultAddress) || !ethers.isAddress(agentAddress)) {
        setStatus('Invalid addresses');
        return;
      }

      // Check and switch to correct network
      const isCorrectNetwork = await checkAndSwitchNetwork();
      if (!isCorrectNetwork) return;

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Create contract instance
      const vaultContract = new ethers.Contract(vaultAddress, VAULT_ABI, signer);

      // Send transaction
      const tx = await vaultContract.setAIAgent(agentAddress);
      setStatus('Transaction sent...');

      // Wait for confirmation
      const receipt = await tx.wait();
      
      // Verify event
      const event = receipt?.logs.find((log: Log) => {
        try {
          const parsed = vaultContract.interface.parseLog(log);
          return parsed?.name === 'AIAgentUpdated';
        } catch {
          return false;
        }
      });

      if (event) {
        setStatus('Agent set successfully! 🎉');
      }

    } catch (switchError: unknown) {
      if (switchError instanceof Error) {
        // Handle specific MetaMask errors
        if ('code' in switchError && switchError.code === 4902) {
          setStatus('Base Mainnet not configured in MetaMask');
        } else {
          console.error('Error:', switchError);
          setStatus(switchError.message || 'Error setting the agent');
        }
      }
    }
  };

  const checkMaxTradeAmount = async () => {
    if (!vaultAddress || !window.ethereum) return;
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const vaultContract = new ethers.Contract(vaultAddress, VAULT_ABI, provider);
      
      const totalAssets = await vaultContract.totalAssets();
      const maxAllocation = await vaultContract.maxTradingAllocation();
      
      console.log('Total Assets:', ethers.formatUnits(totalAssets, 6), 'USDC');
      
      const maxAmount = (totalAssets * BigInt(maxAllocation)) / BigInt(10000);
      setMaxTradeAmount(ethers.formatUnits(maxAmount, 6));
      setTradeStatus(`Maximum tradeable amount: ${ethers.formatUnits(maxAmount, 6)} USDC`);
    } catch (error) {
      console.error('Error checking max trade amount:', error);
      setTradeStatus('Error checking max trade amount');
    }
  };

  const handleTrade = async (isExit: boolean) => {
    try {
      if (!window.ethereum) {
        setTradeStatus('MetaMask is not installed');
        return;
      }

      // Address validation
      if (!ethers.isAddress(tokenAddress)) {
        setTradeStatus('Please insert a valid BRETT token address');
        return;
      }

      // Amount validation
      if (!amountIn || !minAmountOut) {
        setTradeStatus('Invalid amounts');
        return;
      }

      // Check and switch to correct network
      const isCorrectNetwork = await checkAndSwitchNetwork();
      if (!isCorrectNetwork) return;

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Create contract instance
      const vaultContract = new ethers.Contract(vaultAddress, VAULT_ABI, signer);

      // Calculate deadline (30 minutes from now)
      const deadline = Math.floor(Date.now() / 1000) + 1800;

      // Prepare transaction
      const tx = isExit 
        ? await vaultContract.exitTrade(
            tokenAddress,
            ethers.parseUnits(amountIn, 18),
            ethers.parseUnits(minAmountOut, 18),
            deadline
          )
        : await vaultContract.executeTrade(
            tokenAddress,
            ethers.parseUnits(amountIn, 18),
            ethers.parseUnits(minAmountOut, 18),
            deadline
          );

      setTradeStatus('Transaction sent...');

      // Wait for confirmation
      const receipt = await tx.wait();
      
      // Verify event
      const event = receipt?.logs.find((log: Log) => {
        try {
          const parsed = vaultContract.interface.parseLog(log);
          return parsed?.name === 'TradeExecuted';
        } catch {
          return false;
        }
      });

      if (event) {
        setTradeStatus(`Trade ${isExit ? 'exit' : 'execution'} successful! 🎉`);
      }

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error);
        setTradeStatus(error.message || 'Error executing trade');
      }
    }
  };

  return (
    <div className='flex w-full p-2 gap-2'>
        <div className="p-6 w-1/2 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Set Trading Agent</h2>
            
            <div className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700">
                    Vault Address
                </label>
                <input
                    type="text"
                    value={vaultAddress}
                    onChange={(e) => setVaultAddress(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="0x..."
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700">
                    Agent Address
                </label>
                <input
                    type="text"
                    value={agentAddress}
                    onChange={(e) => setAgentAddress(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="0x..."
                />
                </div>

                <button
                onClick={handleSetAgent}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                Set Agent
                </button>

                {status && (
                <div className="mt-4 p-2 rounded bg-gray-100">
                    <p className="text-sm break-words overflow-hidden">{status}</p>
                </div>
                )}
            </div>
        </div>
        <div className='p-6 w-1/2 bg-white rounded-xl shadow-md'>
            <h2 className="text-xl font-bold mb-4">Trading Operations</h2>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Token Address (BRETT)
                    </label>
                    <input
                        type="text"
                        value={tokenAddress}
                        onChange={(e) => setTokenAddress(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="0x..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Amount In
                    </label>
                    <input
                        type="text"
                        value={amountIn}
                        onChange={(e) => setAmountIn(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Amount"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Minimum Amount Out
                    </label>
                    <input
                        type="text"
                        value={minAmountOut}
                        onChange={(e) => setMinAmountOut(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Min amount to receive"
                    />
                </div>

                <button
                    onClick={checkMaxTradeAmount}
                    className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                    Check Max Trade Amount
                </button>

                <div className="flex gap-4">
                    <button
                        onClick={() => handleTrade(false)}
                        className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        USDC → BRETT
                    </button>

                    <button
                        onClick={() => handleTrade(true)}
                        className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        BRETT → USDC
                    </button>
                </div>

                {tradeStatus && (
                    <div className="mt-4 p-2 rounded bg-gray-100">
                        <p className="text-sm break-words overflow-hidden">{tradeStatus}</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default TradingAgentSetup;