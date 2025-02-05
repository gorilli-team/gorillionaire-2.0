// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";

contract HelperConfig is Script {
    struct NetworkConfig {
        address usdcContractAddress;
    }

    NetworkConfig public activeNetworkConfig;

    constructor() {
        if (block.chainid == 84532) {
            activeNetworkConfig = getBaseSepoliaConfig();
        } else {
            activeNetworkConfig = getOrCreateAnvilEthConfig();
        }
    }

    function getBaseSepoliaConfig() public view returns (NetworkConfig memory) {
        NetworkConfig memory baseSepoliaNetworkConfig = NetworkConfig({
            usdcContractAddress: 0x036CbD53842c5426634e7929541eC2318f3dCF7e
        });

        console.log(
            "Base Sepolia network config:",
            baseSepoliaNetworkConfig.usdcContractAddress
        );
        return baseSepoliaNetworkConfig;
    }

    function getOrCreateAnvilEthConfig() public returns (NetworkConfig memory) {
        if (activeNetworkConfig.usdcContractAddress != address(0)) {
            return activeNetworkConfig;
        }
        vm.startBroadcast();
        NetworkConfig memory anvilEthNetworkConfig = NetworkConfig({
            usdcContractAddress: 0x036CbD53842c5426634e7929541eC2318f3dCF7e
        });
        vm.stopBroadcast();
        console.log(
            "Anvil network config:",
            anvilEthNetworkConfig.usdcContractAddress
        );
        return anvilEthNetworkConfig;
    }

    function getUsdcContractAddress() public view returns (address) {
        return activeNetworkConfig.usdcContractAddress;
    }
}
