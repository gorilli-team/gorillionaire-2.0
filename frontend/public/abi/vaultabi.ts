export const vaultAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_asset",
        type: "address",
        internalType: "contract IERC20"
      },
      {
        name: "_basisPoints",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "_maxBasisPoints",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "_uniswapRouter",
        type: "address",
        internalType: "address"
      }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "aiAgent",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address"
      },
      {
        name: "spender",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      {
        name: "spender",
        type: "address",
        internalType: "address"
      },
      {
        name: "value",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool"
      }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "asset",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "claimableDepositRequest",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "convertToAssets",
    inputs: [
      {
        name: "shares",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "convertToShares",
    inputs: [
      {
        name: "assets",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint8",
        internalType: "uint8"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "deposit",
    inputs: [
      {
        name: "assets",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "receiver",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "entryFeeBasisPoints",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "executeTrade",
    inputs: [
      {
        name: "tokenOut",
        type: "address",
        internalType: "address"
      },
      {
        name: "amountIn",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "minAmountOut",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "deadline",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "exitTrade",
    inputs: [
      {
        name: "tokenIn",
        type: "address",
        internalType: "address"
      },
      {
        name: "amountIn",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "minAmountOut",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "deadline",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "isOperator",
    inputs: [
      {
        name: "controller",
        type: "address",
        internalType: "address"
      },
      {
        name: "operator",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "maxDeposit",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "maxEntryFeeBasisPoints",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "maxMint",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "maxRedeem",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "maxTradingAllocation",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "maxWithdraw",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "mint",
    inputs: [
      {
        name: "shares",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "receiver",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "string",
        internalType: "string"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "pendingDepositRequest",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "previewDeposit",
    inputs: [
      {
        name: "assets",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "previewMint",
    inputs: [
      {
        name: "shares",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "previewRedeem",
    inputs: [
      {
        name: "shares",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "previewWithdraw",
    inputs: [
      {
        name: "assets",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "redeem",
    inputs: [
      {
        name: "shares",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "receiver",
        type: "address",
        internalType: "address"
      },
      {
        name: "owner",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "requestDeposit",
    inputs: [
      {
        name: "assets",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "controller",
        type: "address",
        internalType: "address"
      },
      {
        name: "owner",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "requestId",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "requestRedeem",
    inputs: [
      {
        name: "shares",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "owner",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "requestId",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "rescueToken",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "setAIAgent",
    inputs: [
      {
        name: "_newAgent",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "setMaxTradingAllocation",
    inputs: [
      {
        name: "_newAllocation",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "setOperator",
    inputs: [
      {
        name: "operator",
        type: "address",
        internalType: "address"
      },
      {
        name: "approved",
        type: "bool",
        internalType: "bool"
      }
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool"
      }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "string",
        internalType: "string"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "totalAssets",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "transfer",
    inputs: [
      {
        name: "to",
        type: "address",
        internalType: "address"
      },
      {
        name: "value",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool"
      }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "transferFrom",
    inputs: [
      {
        name: "from",
        type: "address",
        internalType: "address"
      },
      {
        name: "to",
        type: "address",
        internalType: "address"
      },
      {
        name: "value",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool"
      }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [
      {
        name: "newOwner",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "uniswapRouter",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IUniswapV2Router02"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "updateEntryFeeBasisPoints",
    inputs: [
      {
        name: "newBasisPoints",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [
      {
        name: "assets",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "receiver",
        type: "address",
        internalType: "address"
      },
      {
        name: "owner",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "event",
    name: "AIAgentUpdated",
    inputs: [
      {
        name: "oldAgent",
        type: "address",
        indexed: true,
        internalType: "address"
      },
      {
        name: "newAgent",
        type: "address",
        indexed: true,
        internalType: "address"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "Approval",
    inputs: [
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address"
      },
      {
        name: "spender",
        type: "address",
        indexed: true,
        internalType: "address"
      },
      {
        name: "value",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "Deposit",
    inputs: [
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address"
      },
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address"
      },
      {
        name: "assets",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      },
      {
        name: "shares",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "DepositRequest",
    inputs: [
      {
        name: "controller",
        type: "address",
        indexed: false,
        internalType: "address"
      },
      {
        name: "owner",
        type: "address",
        indexed: false,
        internalType: "address"
      },
      {
        name: "requestId",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      },
      {
        name: "requester",
        type: "address",
        indexed: false,
        internalType: "address"
      },
      {
        name: "assets",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "EntryFeeUpdated",
    inputs: [
      {
        name: "oldFee",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      },
      {
        name: "newFee",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "MaxTradingAllocationUpdated",
    inputs: [
      {
        name: "oldAllocation",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      },
      {
        name: "newAllocation",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "OperatorSet",
    inputs: [
      {
        name: "owner",
        type: "address",
        indexed: false,
        internalType: "address"
      },
      {
        name: "operator",
        type: "address",
        indexed: false,
        internalType: "address"
      },
      {
        name: "approved",
        type: "bool",
        indexed: false,
        internalType: "bool"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address"
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "RedeemRequest",
    inputs: [
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address"
      },
      {
        name: "requester",
        type: "address",
        indexed: true,
        internalType: "address"
      },
      {
        name: "requestId",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      },
      {
        name: "shares",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      },
      {
        name: "assets",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "TradeExecuted",
    inputs: [
      {
        name: "tokenIn",
        type: "address",
        indexed: true,
        internalType: "address"
      },
      {
        name: "tokenOut",
        type: "address",
        indexed: true,
        internalType: "address"
      },
      {
        name: "amountIn",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      },
      {
        name: "amountOut",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      {
        name: "from",
        type: "address",
        indexed: true,
        internalType: "address"
      },
      {
        name: "to",
        type: "address",
        indexed: true,
        internalType: "address"
      },
      {
        name: "value",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "Withdraw",
    inputs: [
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address"
      },
      {
        name: "receiver",
        type: "address",
        indexed: true,
        internalType: "address"
      },
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address"
      },
      {
        name: "assets",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      },
      {
        name: "shares",
        type: "uint256",
        indexed: false,
        internalType: "uint256"
      }
    ],
    anonymous: false
  },
  {
    type: "error",
    name: "ERC20InsufficientAllowance",
    inputs: [
      {
        name: "spender",
        type: "address",
        internalType: "address"
      },
      {
        name: "allowance",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "needed",
        type: "uint256",
        internalType: "uint256"
      }
    ]
  },
  {
    type: "error",
    name: "ERC20InsufficientBalance",
    inputs: [
      {
        name: "sender",
        type: "address",
        internalType: "address"
      },
      {
        name: "balance",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "needed",
        type: "uint256",
        internalType: "uint256"
      }
    ]
  },
  {
    type: "error",
    name: "ERC20InvalidApprover",
    inputs: [
      {
        name: "approver",
        type: "address",
        internalType: "address"
      }
    ]
  },
  {
    type: "error",
    name: "ERC20InvalidReceiver",
    inputs: [
      {
        name: "receiver",
        type: "address",
        internalType: "address"
      }
    ]
  },
  {
    type: "error",
    name: "ERC20InvalidSender",
    inputs: [
      {
        name: "sender",
        type: "address",
        internalType: "address"
      }
    ]
  },
  {
    type: "error",
    name: "ERC20InvalidSpender",
    inputs: [
      {
        name: "spender",
        type: "address",
        internalType: "address"
      }
    ]
  },
  {
    type: "error",
    name: "ERC4626ExceededMaxDeposit",
    inputs: [
      {
        name: "receiver",
        type: "address",
        internalType: "address"
      },
      {
        name: "assets",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "max",
        type: "uint256",
        internalType: "uint256"
      }
    ]
  },
  {
    type: "error",
    name: "ERC4626ExceededMaxMint",
    inputs: [
      {
        name: "receiver",
        type: "address",
        internalType: "address"
      },
      {
        name: "shares",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "max",
        type: "uint256",
        internalType: "uint256"
      }
    ]
  },
  {
    type: "error",
    name: "ERC4626ExceededMaxRedeem",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address"
      },
      {
        name: "shares",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "max",
        type: "uint256",
        internalType: "uint256"
      }
    ]
  },
  {
    type: "error",
    name: "ERC4626ExceededMaxWithdraw",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address"
      },
      {
        name: "assets",
        type: "uint256",
        internalType: "uint256"
      },
      {
        name: "max",
        type: "uint256",
        internalType: "uint256"
      }
    ]
  },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address"
      }
    ]
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address"
      }
    ]
  },
  {
    type: "error",
    name: "SafeERC20FailedOperation",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address"
      }
    ]
  }
]