// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {GorillionaireVault} from "../src/GorillionaireVault.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

contract DeployGorillionaireVault is Script {
    HelperConfig public helperConfig = new HelperConfig();

    // Uniswap router address on Base Sepolia
    address constant UNISWAP_ROUTER =
        0x4df04E20cCd9a8B82634754fcB041e86c5FF085A;

    function deploy() public returns (GorillionaireVault) {
        vm.startBroadcast();

        console.log("Deploying GorillionaireVault...");
        console.log(
            "USDC contract address:",
            helperConfig.getUsdcContractAddress()
        );

        GorillionaireVault vault = new GorillionaireVault(
            IERC20(helperConfig.getUsdcContractAddress()), // _asset
            10000, // _basisPoints (entry fee basis points)
            20000, // _maxBasisPoints (max entry fee basis points)
            UNISWAP_ROUTER // Uniswap router address
        );

        console.log("GorillionaireVault deployed at:", address(vault));

        vm.stopBroadcast();
        return vault;
    }

    function run() public {
        deploy();
    }
}
