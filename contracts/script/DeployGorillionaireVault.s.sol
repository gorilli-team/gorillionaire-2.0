//SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {GorillionaireVault} from "../src/GorillionaireVault.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {HelperConfig} from "./HelperConfig.sol";

contract DeployGorillionaireVault is Script {
    HelperConfig public helperConfig = new HelperConfig();

    function deploy() public returns (GorillionaireVault) {
        vm.startBroadcast();

        console.log("Deploying GorillionaireVault...");
        // I want to console.log the usdcContractAddress from helperConfig
        console.log(
            "USDC contract address:",
            helperConfig.getUsdcContractAddress()
        );
        GorillionaireVault vault = new GorillionaireVault(
            IERC20(helperConfig.getUsdcContractAddress()),
            10000
        );
        console.log("GorillionaireVault deployed at:", address(vault));

        vm.stopBroadcast();
        return vault;
    }

    function run() public {
        deploy();
    }
}
