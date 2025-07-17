// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/CarvIdNFT.sol";
import "../src/MedicalResearchResults.sol";

contract DeployMedicalResearch is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying contracts with the account:", deployer);
        console.log("Account balance:", deployer.balance);

        vm.startBroadcast(deployerPrivateKey);

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
        console.log("=== Deployment Summary ===");
        console.log("CarvIdNFT Address:", address(carvIdNFT));
        console.log("MedicalResearchResults Address:", address(medicalResearchResults));
        console.log("Deployer Address:", deployer);
        console.log("=========================");

        // Verify contracts are deployed correctly
        console.log("CarvIdNFT Name:", carvIdNFT.name());
        console.log("CarvIdNFT Symbol:", carvIdNFT.symbol());
        console.log("CarvIdNFT Owner:", carvIdNFT.owner());
    }
}
