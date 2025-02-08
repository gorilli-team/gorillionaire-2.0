// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {ERC4626, Math, IERC20, ERC20, SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/extensions/ERC4626.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

interface IUniswapV2Router02 {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function getAmountsOut(
        uint amountIn,
        address[] calldata path
    ) external view returns (uint[] memory amounts);
}

contract GorillionaireVault is ERC4626, Ownable {
    using Math for uint256;
    using SafeERC20 for IERC20;

    mapping(address => uint256) public pendingDepositRequest;
    mapping(address => uint256) public claimableDepositRequest;
    mapping(address controller => mapping(address operator => bool))
        public isOperator;

    // Whitelist functionality
    mapping(address => bool) public whitelistedTokens;
    bool public whitelistEnabled;

    // Trading functionality state variables
    address public aiAgent;
    IUniswapV2Router02 public immutable uniswapRouter;
    uint256 public maxTradingAllocation;

    uint256 private constant _BASIS_POINT_SCALE = 1e4;
    uint256 public entryFeeBasisPoints;
    uint256 public immutable maxEntryFeeBasisPoints;

    // Events
    event DepositRequest(
        address controller,
        address owner,
        uint256 requestId,
        address requester,
        uint256 assets
    );
    event RedeemRequest(
        address indexed owner,
        address indexed requester,
        uint256 requestId,
        uint256 shares,
        uint256 assets
    );
    event OperatorSet(address owner, address operator, bool approved);
    event EntryFeeUpdated(uint256 oldFee, uint256 newFee);
    event AIAgentUpdated(address indexed oldAgent, address indexed newAgent);
    event TradeExecuted(
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );
    event MaxTradingAllocationUpdated(
        uint256 oldAllocation,
        uint256 newAllocation
    );
    // Whitelist events
    event TokenWhitelistUpdated(address indexed token, bool status);
    event WhitelistStatusUpdated(bool status);

    modifier canMakeRequests(address owner) {
        require(
            owner == msg.sender || isOperator[owner][msg.sender],
            "Not authorized"
        );
        _;
    }

    modifier onlyAIAgent() {
        require(msg.sender == aiAgent, "Only AI agent can execute trades");
        _;
    }

    modifier onlyWhitelisted(address token) {
        require(
            !whitelistEnabled || whitelistedTokens[token],
            "Token not whitelisted"
        );
        _;
    }

    constructor(
        IERC20 _asset,
        uint256 _basisPoints,
        uint256 _maxBasisPoints,
        address _uniswapRouter
    )
        Ownable(msg.sender)
        ERC4626(_asset)
        ERC20("Gorillionaire Vault Token", "vGOR")
    {
        entryFeeBasisPoints = _basisPoints;
        maxEntryFeeBasisPoints = _maxBasisPoints;
        uniswapRouter = IUniswapV2Router02(_uniswapRouter);
        maxTradingAllocation = 5000; // Default 50% of total assets can be used for trading
        whitelistEnabled = true; // Whitelist enabled by default
    }

    // Deposit and Redeem functions
    function requestDeposit(
        uint256 assets,
        address controller,
        address owner
    ) external canMakeRequests(owner) returns (uint256 requestId) {
        require(assets != 0, "Assets cannot be zero");

        requestId = 0; // request ID logic to be implemented

        IERC20(asset()).transferFrom(owner, address(this), assets);

        pendingDepositRequest[controller] += assets;

        emit DepositRequest(controller, owner, requestId, msg.sender, assets);
        return requestId;
    }

    function requestRedeem(
        uint256 shares,
        address owner
    ) external canMakeRequests(owner) returns (uint256 requestId) {
        require(shares != 0, "Shares cannot be zero");

        uint256 assets = previewRedeem(shares);

        _transfer(owner, address(this), shares);

        requestId = 0; // request ID logic to be implemented

        emit RedeemRequest(owner, msg.sender, requestId, shares, assets);

        return requestId;
    }

    // Operator management
    function setOperator(
        address operator,
        bool approved
    ) public returns (bool) {
        isOperator[msg.sender][operator] = approved;
        emit OperatorSet(msg.sender, operator, approved);
        return true;
    }

    // AI Agent management functions
    function setAIAgent(address _newAgent) external onlyOwner {
        require(_newAgent != address(0), "Invalid agent address");
        emit AIAgentUpdated(aiAgent, _newAgent);
        aiAgent = _newAgent;
    }

    function setMaxTradingAllocation(
        uint256 _newAllocation
    ) external onlyOwner {
        require(_newAllocation <= 10000, "Allocation cannot exceed 100%");
        emit MaxTradingAllocationUpdated(maxTradingAllocation, _newAllocation);
        maxTradingAllocation = _newAllocation;
    }

    // Whitelist management functions
    function setTokenWhitelist(address token, bool status) external onlyOwner {
        require(token != address(0), "Invalid token address");
        whitelistedTokens[token] = status;
        emit TokenWhitelistUpdated(token, status);
    }

    function batchSetTokenWhitelist(
        address[] calldata tokens,
        bool[] calldata statuses
    ) external onlyOwner {
        require(tokens.length == statuses.length, "Arrays length mismatch");

        for (uint256 i = 0; i < tokens.length; i++) {
            require(tokens[i] != address(0), "Invalid token address");
            whitelistedTokens[tokens[i]] = statuses[i];
            emit TokenWhitelistUpdated(tokens[i], statuses[i]);
        }
    }

    function setWhitelistStatus(bool status) external onlyOwner {
        whitelistEnabled = status;
        emit WhitelistStatusUpdated(status);
    }

    function isTokenWhitelisted(address token) external view returns (bool) {
        if (!whitelistEnabled) return true;
        return whitelistedTokens[token];
    }

    function executeTrade(
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut,
        uint256 deadline
    ) external onlyAIAgent onlyWhitelisted(tokenOut) {
        require(tokenOut != address(0), "Invalid token address");

        // Calculate maximum tradeable amount
        uint256 maxTradeAmount = (totalAssets() * maxTradingAllocation) / 10000;
        require(
            amountIn <= maxTradeAmount,
            "Amount exceeds trading allocation"
        );

        // Get the asset token and approve router
        IERC20 assetToken = IERC20(asset());
        assetToken.safeIncreaseAllowance(address(uniswapRouter), amountIn);

        // Setup path
        address[] memory path = new address[](2);
        path[0] = asset();
        path[1] = tokenOut;

        // Execute swap
        uint[] memory amounts = uniswapRouter.swapExactTokensForTokens(
            amountIn,
            minAmountOut,
            path,
            address(this),
            deadline
        );

        emit TradeExecuted(asset(), tokenOut, amounts[0], amounts[1]);
    }

    function exitTrade(
        address tokenIn,
        uint256 amountIn,
        uint256 minAmountOut,
        uint256 deadline
    ) external onlyAIAgent onlyWhitelisted(tokenIn) {
        require(tokenIn != address(0), "Invalid token address");

        IERC20 token = IERC20(tokenIn);
        require(
            token.balanceOf(address(this)) >= amountIn,
            "Insufficient balance"
        );

        // Approve router
        token.safeIncreaseAllowance(address(uniswapRouter), amountIn);

        // Setup path
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = asset();

        // Execute swap back to vault asset
        uint[] memory amounts = uniswapRouter.swapExactTokensForTokens(
            amountIn,
            minAmountOut,
            path,
            address(this),
            deadline
        );

        emit TradeExecuted(tokenIn, asset(), amounts[0], amounts[1]);
    }

    // Fee management
    function updateEntryFeeBasisPoints(
        uint256 newBasisPoints
    ) external onlyOwner {
        require(newBasisPoints <= maxEntryFeeBasisPoints, "Entry fee too high");
        emit EntryFeeUpdated(entryFeeBasisPoints, newBasisPoints);
        entryFeeBasisPoints = newBasisPoints;
    }

    // Preview functions
    function previewDeposit(
        uint256 assets
    ) public view virtual override returns (uint256) {
        uint256 fee = _feeOnTotal(assets, _entryFeeBasisPoints());
        return super.previewDeposit(assets - fee);
    }

    function previewMint(
        uint256 shares
    ) public view virtual override returns (uint256) {
        uint256 assets = super.previewMint(shares);
        return assets + _feeOnRaw(assets, _entryFeeBasisPoints());
    }

    function previewWithdraw(
        uint256 assets
    ) public view virtual override returns (uint256) {
        uint256 fee = _feeOnRaw(assets, _exitFeeBasisPoints());
        return super.previewWithdraw(assets + fee);
    }

    function previewRedeem(
        uint256 shares
    ) public view virtual override returns (uint256) {
        uint256 assets = super.previewRedeem(shares);
        return assets - _feeOnTotal(assets, _exitFeeBasisPoints());
    }

    // Internal functions
    function _deposit(
        address caller,
        address receiver,
        uint256 assets,
        uint256 shares
    ) internal virtual override {
        uint256 fee = _feeOnTotal(assets, _entryFeeBasisPoints());
        address recipient = _entryFeeRecipient();

        super._deposit(caller, receiver, assets, shares);

        if (fee > 0 && recipient != address(this)) {
            SafeERC20.safeTransfer(IERC20(asset()), recipient, fee);
        }
    }

    function _withdraw(
        address caller,
        address receiver,
        address owner,
        uint256 assets,
        uint256 shares
    ) internal virtual override {
        uint256 fee = _feeOnRaw(assets, _exitFeeBasisPoints());
        address recipient = _exitFeeRecipient();

        super._withdraw(caller, receiver, owner, assets, shares);

        if (fee > 0 && recipient != address(this)) {
            SafeERC20.safeTransfer(IERC20(asset()), recipient, fee);
        }
    }

    function _entryFeeBasisPoints() internal view virtual returns (uint256) {
        return entryFeeBasisPoints;
    }

    function _exitFeeBasisPoints() internal view virtual returns (uint256) {
        return 100; // 1% exit fee
    }

    function _entryFeeRecipient() internal view virtual returns (address) {
        return owner();
    }

    function _exitFeeRecipient() internal view virtual returns (address) {
        return address(0); // Set this to the treasury address
    }

    function _feeOnRaw(
        uint256 assets,
        uint256 feeBasisPoints
    ) private pure returns (uint256) {
        uint256 numerator = assets * feeBasisPoints;
        uint256 denominator = _BASIS_POINT_SCALE;
        uint256 result = numerator / denominator;
        return result + (numerator % denominator != 0 ? 1 : 0);
    }

    function _feeOnTotal(
        uint256 assets,
        uint256 feeBasisPoints
    ) private pure returns (uint256) {
        uint256 numerator = assets * feeBasisPoints;
        uint256 denominator = feeBasisPoints + _BASIS_POINT_SCALE;
        uint256 result = numerator / denominator;
        return result + (numerator % denominator != 0 ? 1 : 0);
    }

    // Emergency function
    function rescueToken(address token) external onlyOwner {
        require(token != asset(), "Cannot rescue vault asset");
        uint256 balance = IERC20(token).balanceOf(address(this));
        IERC20(token).safeTransfer(owner(), balance);
    }
}
