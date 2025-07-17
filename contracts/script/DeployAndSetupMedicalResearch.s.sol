// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/CarvIdNFT.sol";
import "../src/MedicalResearchResults.sol";

contract DeployAndSetupMedicalResearch is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying and setting up contracts with the account:", deployer);
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

        // Example: Mint a demo NFT for testing
        console.log("Minting demo NFT...");
        carvIdNFT.mint(deployer, 1, "https://example.com/metadata/1");
        console.log("Demo NFT minted with ID 1 to:", deployer);

        // Example: Grant access to a demo agent for testing
        address demoAgent = address(0x1234567890123456789012345678901234567890);
        bytes32 drugDiscoveryDataType = keccak256("drug_discovery_data");
        
        console.log("Granting access to demo agent...");
        carvIdNFT.grantAccess(1, demoAgent, drugDiscoveryDataType);
        console.log("Access granted to agent:", demoAgent);

        // Example: Submit a demo research result
        console.log("Submitting demo research result...");
        medicalResearchResults.submitAggregatedResult(
            "alzheimer_treatment",
            keccak256("demo_research_result_hash"),
            95, // 95% accuracy
            demoAgent
        );
        console.log("Demo research result submitted");

        vm.stopBroadcast();

        // Log deployment information
        console.log("=== Deployment Summary ===");
        console.log("CarvIdNFT Address:", address(carvIdNFT));
        console.log("MedicalResearchResults Address:", address(medicalResearchResults));
        console.log("Deployer Address:", deployer);
        console.log("Demo Agent Address:", demoAgent);
        console.log("=========================");

        // Verify setup
        console.log("=== Verification ===");
        console.log("CarvIdNFT Name:", carvIdNFT.name());
        console.log("CarvIdNFT Symbol:", carvIdNFT.symbol());
        console.log("CarvIdNFT Owner:", carvIdNFT.owner());
        console.log("Token Counter:", carvIdNFT._tokenIdCounter());
        console.log("Owner of Token 1:", carvIdNFT.ownerOf(1));
        console.log("Agent has access:", carvIdNFT.hasAccess(1, demoAgent, drugDiscoveryDataType));
        
        // Check research result
        (bytes32 resultHash, uint256 accuracy) = medicalResearchResults.getResearchResult("alzheimer_treatment", demoAgent);
        console.log("Research result hash:", vm.toString(resultHash));
        console.log("Research result accuracy:", accuracy);
        console.log("===================");
    }
}
