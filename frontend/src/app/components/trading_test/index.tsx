import React, { useState, useEffect } from 'react';
import { ethers, Log } from 'ethers';
import { useAccount } from 'wagmi';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      chainId?: string;
    };
  }
}

const VAULT_ABI = [
  "function setAIAgent(address _newAgent) external",
  "event AIAgentUpdated(address indexed oldAgent, address indexed newAgent)",
  "function executeTrade(address tokenOut, uint256 amountIn, uint256 minAmountOut, uint256 deadline) external",
  "function exitTrade(address tokenIn, uint256 amountIn, uint256 minAmountOut, uint256 deadline) external",
  "event TradeExecuted(address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut)",
  "function totalAssets() external view returns (uint256)",
  "function maxTradingAllocation() external view returns (uint256)",
  "function aiAgent() external view returns (address)"
];

const BASE_CHAIN_ID = "0x2105";

const TradingAgentSetup = () => {
  // States for agent setup
  const [vaultAddress, setVaultAddress] = useState('');
  const [agentAddress, setAgentAddress] = useState('');
  const [status, setStatus] = useState('');
  const [currentAgent, setCurrentAgent] = useState<string | null>(null);

  // States for trading operations
  const [tokenAddress, setTokenAddress] = useState('');
  const [amountIn, setAmountIn] = useState('');
  const [minAmountOut, setMinAmountOut] = useState('');
  const [tradeStatus, setTradeStatus] = useState('');

  const account = useAccount();
  const [showSetAgent, setShowSetAgent] = useState(false);

  useEffect(() => {
    const checkOwnership = async () => {
      if (!account.isConnected) return;
      const ownerAddress = process.env.NEXT_PUBLIC_DEPLOYED_CONTRACT_WALLET_ADDRESS;
      setShowSetAgent(account.address?.toLowerCase() === ownerAddress?.toLowerCase());
    };

    checkOwnership();
  }, [account.isConnected, account.address]);

  const checkCurrentAgent = async (vaultContractAddress: string): Promise<boolean> => {
    if (!window.ethereum || !vaultContractAddress) return false;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const vaultContract = new ethers.Contract(vaultContractAddress, VAULT_ABI, provider);
      
      const agent = await vaultContract.aiAgent();
      setCurrentAgent(agent);
      
      // Check if agent is set (address is not zero)
      return agent !== "0x0000000000000000000000000000000000000000";
    } catch (error) {
      console.error('Error checking current agent:', error);
      return false;
    }
  };

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

      if (!ethers.isAddress(vaultAddress) || !ethers.isAddress(agentAddress)) {
        setStatus('Invalid addresses');
        return;
      }

      const isCorrectNetwork = await checkAndSwitchNetwork();
      if (!isCorrectNetwork) return;

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const vaultContract = new ethers.Contract(vaultAddress, VAULT_ABI, signer);

      const tx = await vaultContract.setAIAgent(agentAddress);
      setStatus('Transaction sent...');

      const receipt = await tx.wait();
      
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
        setCurrentAgent(agentAddress);
      }

    } catch (switchError: unknown) {
      if (switchError instanceof Error) {
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
      const provider = new ethers.BrowserProvider(window.ethereum);
      const vaultContract = new ethers.Contract(vaultAddress, VAULT_ABI, provider);
      
      const totalAssets = await vaultContract.totalAssets();
      const maxAllocation = await vaultContract.maxTradingAllocation();
      
      const maxAmount = (totalAssets * BigInt(maxAllocation)) / BigInt(10000);
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

      if (!vaultAddress) {
        setTradeStatus('Please enter a vault address');
        return;
      }

      const hasAgent = await checkCurrentAgent(vaultAddress);
      if (!hasAgent) {
        setTradeStatus('Trading agent not set. Please set an agent before trading.');
        return;
      }

      if (!ethers.isAddress(tokenAddress)) {
        setTradeStatus('Please insert a valid BRETT token address');
        return;
      }

      if (!amountIn || !minAmountOut) {
        setTradeStatus('Invalid amounts');
        return;
      }

      const isCorrectNetwork = await checkAndSwitchNetwork();
      if (!isCorrectNetwork) return;

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const vaultContract = new ethers.Contract(vaultAddress, VAULT_ABI, signer);

      const deadline = Math.floor(Date.now() / 1000) + 1800;

      const tx = isExit 
        ? await vaultContract.exitTrade(
            tokenAddress,
            ethers.parseUnits(amountIn, 18),
            ethers.parseUnits(minAmountOut, 6),
            deadline
          )
        : await vaultContract.executeTrade(
            tokenAddress,
            ethers.parseUnits(amountIn, 6),
            ethers.parseUnits(minAmountOut, 6), 
            deadline
          );

      setTradeStatus('Transaction sent...');

      const receipt = await tx.wait();
      
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
    <div className='flex w-full p-2 py-4 gap-4 justify-center'>
      {showSetAgent && (
        <div className="p-6 w-[600px] max-w-[600px] bg-white rounded-xl shadow-md">
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none"
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
      )}
      <div className={`p-6 ${showSetAgent ? 'w-[600px] max-w-[600px]' : 'w-full'} bg-white rounded-xl shadow-md`}>
        <h2 className="text-xl font-bold mb-4">Trading Operations</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vault Address
            </label>
            <input
              type="text"
              value={vaultAddress}
              onChange={(e) => setVaultAddress(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none"
              placeholder="0x..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Token Address (BRETT)
            </label>
            <input
              type="text"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none"
              placeholder="Min amount to receive"
            />
          </div>

          <button
            onClick={checkMaxTradeAmount}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Check Max Trade Amount
          </button>

          <button
            onClick={() => checkCurrentAgent(vaultAddress)}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Show Agent Address
          </button>

          <div className="mt-4 p-2 rounded bg-blue-100">
            <p className="text-sm font-medium text-blue-800 break-words overflow-hidden">
              {currentAgent 
                ? `Current Agent: ${currentAgent}`
                : "No agent set for this vault"
              }
            </p>
          </div>

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