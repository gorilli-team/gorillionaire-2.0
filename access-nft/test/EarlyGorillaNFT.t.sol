// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {EarlyGorillaNFT} from "../src/EarlyGorillaNFT.sol";

contract EarlyGorillaTest is Test {
    EarlyGorillaNFT nft;
    address owner = makeAddr("owner");
    address user1 = makeAddr("user1");
    string testURI = "https://test.xyz/";

    function setUp() public {
        vm.prank(owner);
        nft = new EarlyGorillaNFT(testURI);
    }

    function testInitialization() public view {
        assertEq(nft.name(), "Early Gorillas");
        assertEq(nft.symbol(), "E-GOR");
        assertEq(nft.owner(), owner);
    }

    function testMint() public {
        vm.prank(user1);
        nft.mint();

        assertEq(nft.balanceOf(user1), 1);
        assertEq(nft.ownerOf(1), user1);
        assertEq(nft.tokenURI(1), string.concat(testURI, "base.json"));
    }

    function testMintRevert() public {
        vm.startPrank(user1);

        nft.mint();
        assertEq(nft.balanceOf(user1), 1);

        vm.expectRevert();
        nft.mint();
    }

    function testPremium() public {
        vm.prank(user1);
        nft.mint();

        assertEq(nft.tokenURI(1), string.concat(testURI, "base.json"));

        vm.prank(owner);
        nft.setPremium(true, 1);
        assertEq(nft.tokenURI(1), string.concat(testURI, "premium.json"));
    }
}
