// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {EarlyGorillaNFT} from "../src/EarlyGorillaNFT.sol";

contract NFTSetup is Script {
    EarlyGorillaNFT nft =
        EarlyGorillaNFT(0xD0f38A3Fb0F71e3d2B60e90327afde25618e1150);

    function run() external {
        vm.startBroadcast();
        nft.setBaseUri("https://app.gorillionai.re/nft-metadata/");
        vm.stopBroadcast();
    }
}
