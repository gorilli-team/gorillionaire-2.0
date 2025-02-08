// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";

contract HelperConfig is Script {
    struct NetworkConfig {
        address usdcContractAddress;
    }

    NetworkConfig public activeNetworkConfig;

    constructor() {
        if (block.chainid == 8453) {
            activeNetworkConfig = getBaseConfig();
        } else {
            activeNetworkConfig = getOrCreateAnvilEthConfig();
        }
    }

    function getBaseConfig() public view returns (NetworkConfig memory) {
        NetworkConfig memory baseNetworkConfig = NetworkConfig({
            usdcContractAddress: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
        });

        console.log(
            "Base network config:",
            baseNetworkConfig.usdcContractAddress
        );
        return baseNetworkConfig;
    }

    function getOrCreateAnvilEthConfig() public returns (NetworkConfig memory) {
        if (activeNetworkConfig.usdcContractAddress != address(0)) {
            return activeNetworkConfig;
        }
        vm.startBroadcast();
        NetworkConfig memory anvilEthNetworkConfig = NetworkConfig({
            usdcContractAddress: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
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
