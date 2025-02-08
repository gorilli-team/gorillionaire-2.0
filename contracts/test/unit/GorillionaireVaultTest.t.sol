// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {GorillionaireVault, IUniswapV2Router02} from "../../src/GorillionaireVault.sol";
import {GorillionaireToken} from "../../src/GorillionaireToken.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {MockERC20} from "../mocks/MockERC20.sol";

contract GorillionaireVaultTest is Test {
    GorillionaireToken token;
    GorillionaireVault vault;
    address constant UNISWAP_ROUTER =
        0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24;

    address bob = makeAddr("bob");
    address alice = makeAddr("alice");
    address treasury = makeAddr("treasury");
    address payable owner = payable(makeAddr("owner"));
    address aiAgent = makeAddr("aiAgent");

    uint256 constant ASSETS_DEPOSITED = 1000 ether;
    uint256 constant FIRST_DEPOSIT = 10 ether;
    uint256 constant SECOND_DEPOSIT = 20 ether;
    uint256 constant ENTRY_FEE_BASIS_POINTS = 500; // 5% entry fee
    uint256 constant MAX_ENTRY_FEE_BASIS_POINTS = 20000; // 200% max entry fee

    function setUp() public {
        token = new GorillionaireToken();
        vault = new GorillionaireVault(
            token,
            ENTRY_FEE_BASIS_POINTS,
            MAX_ENTRY_FEE_BASIS_POINTS,
            UNISWAP_ROUTER
        );
        vault.transferOwnership(owner);
    }

    function testDepositRequest() public {
        uint256 assets = FIRST_DEPOSIT;
        deal(address(token), bob, assets);

        vm.startPrank(bob);
        token.approve(address(vault), assets);
        vault.requestDeposit(assets, bob, bob);
        vm.stopPrank();

        assertEq(
            vault.pendingDepositRequest(bob),
            assets,
            "Incorrect pending deposit amount"
        );
    }

    function testOperatorManagement() public {
        vm.startPrank(bob);
        assertTrue(vault.setOperator(alice, true), "Failed to set operator");
        assertTrue(vault.isOperator(bob, alice), "Operator not set correctly");
        vm.stopPrank();
    }

    function testAIAgentManagement() public {
        vm.startPrank(owner);
        vault.setAIAgent(aiAgent);
        assertEq(vault.aiAgent(), aiAgent, "AI agent not set correctly");
        vm.stopPrank();
    }

    function testMaxTradingAllocation() public {
        vm.startPrank(owner);
        uint256 newAllocation = 6000; // 60%
        vault.setMaxTradingAllocation(newAllocation);
        assertEq(
            vault.maxTradingAllocation(),
            newAllocation,
            "Max trading allocation not set correctly"
        );
        vm.stopPrank();
    }

    function testTradingFunctionality() public {
        // Setup
        vm.startPrank(owner);
        vault.setAIAgent(aiAgent);
        vm.stopPrank();

        // Mock some initial deposits
        deal(address(token), address(vault), ASSETS_DEPOSITED);

        // Test trade execution
        address mockTokenOut = makeAddr("mockToken");
        uint256 amountIn = 100 ether;
        uint256 minAmountOut = 95 ether;
        uint256 deadline = block.timestamp + 1 days;

        vm.startPrank(aiAgent);
        vm.expectRevert();
        vault.executeTrade(mockTokenOut, amountIn, minAmountOut, deadline);
        vm.stopPrank();
    }

    function testEmergencyRescue() public {
        // Deploy a mock token
        MockERC20 mockToken = new MockERC20("Mock", "MCK", 18);

        // Mint some tokens to the vault
        mockToken.mint(address(vault), 100 ether);

        uint256 initialBalance = mockToken.balanceOf(owner);

        vm.startPrank(owner);
        vault.rescueToken(address(mockToken));
        vm.stopPrank();

        assertEq(
            mockToken.balanceOf(owner),
            initialBalance + 100 ether,
            "Token rescue failed"
        );
    }

    function testEntryFeeUpdate() public {
        uint256 newFee = 300; // 3%

        vm.startPrank(owner);
        vault.updateEntryFeeBasisPoints(newFee);
        assertEq(
            vault.entryFeeBasisPoints(),
            newFee,
            "Entry fee not updated correctly"
        );
        vm.stopPrank();
    }

    function test_Revert_SetMaxTradingAllocationTooHigh() public {
        vm.startPrank(owner);
        vm.expectRevert("Allocation cannot exceed 100%");
        vault.setMaxTradingAllocation(10001);
        vm.stopPrank();
    }

    function test_Revert_UnauthorizedDepositRequest() public {
        vm.startPrank(alice);
        vm.expectRevert("Not authorized");
        vault.requestDeposit(FIRST_DEPOSIT, bob, bob);
        vm.stopPrank();
    }
}
