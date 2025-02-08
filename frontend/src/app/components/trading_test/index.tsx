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
  "event AIAgentUpdated(address indexed oldAgent, address indexed newAgent)"
];

// Base Mainnet Chain ID
const BASE_CHAIN_ID = "0x2105"; // 8453 in hex

const TradingAgentSetup = () => {
  const [vaultAddress, setVaultAddress] = useState('');
  const [agentAddress, setAgentAddress] = useState('');
  const [status, setStatus] = useState('');

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

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md">
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
  );
};

export default TradingAgentSetup;