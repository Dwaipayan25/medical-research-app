// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/CarvIdNFT.sol";
import "../src/MedicalResearchResults.sol";

contract DeployLocal is Script {
    function run() external {
        // For local deployment, we can use the default anvil account
        vm.startBroadcast();

        // Deploy CarvIdNFT contract
        console.log("Deploying CarvIdNFT...");
        CarvIdNFT carvIdNFT = new CarvIdNFT(
            "Medical Research CARV ID",
            "MRCID"
        );
        console.log("CarvIdNFT deployed at:", address(carvIdNFT));

        // Deploy MedicalResearchResults contract
        console.log("Deploying MedicalResearchResults...");
        MedicalResearchResults medicalResearchResults = new MedicalResearchResults();
        console.log("MedicalResearchResults deployed at:", address(medicalResearchResults));

        vm.stopBroadcast();

        // Log deployment information
        console.log("=== Local Deployment Summary ===");
        console.log("CarvIdNFT Address:", address(carvIdNFT));
        console.log("MedicalResearchResults Address:", address(medicalResearchResults));
        console.log("CarvIdNFT Name:", carvIdNFT.name());
        console.log("CarvIdNFT Symbol:", carvIdNFT.symbol());
        console.log("================================");
    }
}
