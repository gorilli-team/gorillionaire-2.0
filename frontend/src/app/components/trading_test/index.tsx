import React, { useState, useEffect } from "react";
import { ethers, Log } from "ethers";
import { useAccount } from "wagmi";

declare global {
  interface Window {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
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
  "function aiAgent() external view returns (address)",
];

const BASE_CHAIN_ID = "0x2105";

// ... paste the entire TradingAgentSetup component here with the leaderboard changes ...
