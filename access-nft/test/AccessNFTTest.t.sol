// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Test } from "forge-std/Test.sol";
import { AccessNFT } from "../src/AccessNFT.sol";

contract AccessNFTTest is Test {
    AccessNFT accessNFT;
    address owner = makeAddr("owner");
    address user1 = makeAddr("user1");
    uint256 public INITIAL_BALANCE = 1000000000000000000; // 1 ether
    uint256 public NEW_PRICE = 2000000000000000000; // 2 ether

    function setUp() public {
        vm.prank(owner);
        accessNFT = new AccessNFT();
    }

    //////////////////////////////////////////
    ///////////// INITIALIZATION /////////////
    //////////////////////////////////////////

    function testInitialization() public view {
        assertEq(accessNFT.name(), "Gorillionaire Access NFT");
        assertEq(accessNFT.symbol(), "GOR-AX");
        assertEq(accessNFT.owner(), owner);
    }

    /////////////////////////////////////
    ////////////// MINT NFT /////////////
    /////////////////////////////////////

    function testMintNFT() public {
        vm.deal(user1, INITIAL_BALANCE);
        vm.prank(user1);
        accessNFT.mint{ value: INITIAL_BALANCE }();

        assertEq(accessNFT.balanceOf(user1), 1);
    }

    function testShouldRevertWhenMintingWithNoValueSent() public {
        vm.deal(user1, INITIAL_BALANCE);
        vm.prank(user1);
        vm.expectRevert(AccessNFT.AccessNFT__InsufficientPayment.selector);
        accessNFT.mint{ value: 0 }();
    }

    //////////////////////////////////////
    ///////////// SET PRICE //////////////
    //////////////////////////////////////

    function testSetPrice() public {
        vm.prank(owner);
        accessNFT.setPrice(NEW_PRICE);

        assertEq(accessNFT.s_price(), NEW_PRICE);
    }

    function testShouldNotAllowNonOwnersToSetPrice() public {
        vm.prank(user1);
        vm.expectRevert();
        accessNFT.setPrice(NEW_PRICE);
    }
}