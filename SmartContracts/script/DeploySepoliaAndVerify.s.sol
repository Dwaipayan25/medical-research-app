// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/CarvIdNFT.sol";
import "../src/MedicalResearchResults.sol";

contract DeploySepoliaAndVerify is Script {
    // Contract constructor parameters
    string constant CARV_NFT_NAME = "Medical Research CARV ID";
    string constant CARV_NFT_SYMBOL = "MRCID";
    
    // Sepolia chain ID
    uint256 constant SEPOLIA_CHAIN_ID = 11155111;
    
    function run() external {
        // Get deployment parameters from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("=== Sepolia Deployment Configuration ===");
        console.log("Deployer Address:", deployer);
        console.log("Deployer Balance:", deployer.balance);
        console.log("Chain ID:", block.chainid);
        console.log("Gas Price:", tx.gasprice);
        console.log("========================================");
        
        // Verify we're on Sepolia
        require(block.chainid == SEPOLIA_CHAIN_ID, "Must deploy on Sepolia testnet");
        
        // Ensure deployer has enough ETH
        require(deployer.balance > 0.01 ether, "Insufficient ETH balance for deployment");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy CarvIdNFT contract
        console.log("\n=== Deploying CarvIdNFT ===");
        CarvIdNFT carvIdNFT = new CarvIdNFT{salt: keccak256("CarvIdNFT_v1")}(
            CARV_NFT_NAME,
            CARV_NFT_SYMBOL
        );
        console.log("CarvIdNFT deployed at:", address(carvIdNFT));
        console.log("CarvIdNFT Name:", carvIdNFT.name());
        console.log("CarvIdNFT Symbol:", carvIdNFT.symbol());
        console.log("CarvIdNFT Owner:", carvIdNFT.owner());
        
        // Deploy MedicalResearchResults contract
        console.log("\n=== Deploying MedicalResearchResults ===");
        MedicalResearchResults medicalResearchResults = new MedicalResearchResults{salt: keccak256("MedicalResearchResults_v1")}();
        console.log("MedicalResearchResults deployed at:", address(medicalResearchResults));
        
        vm.stopBroadcast();
        
        // Manual verification instructions
        console.log("\n=== Manual Verification Instructions ===");
        console.log("To verify CarvIdNFT contract, run:");
        console.log("forge verify-contract --chain-id 11155111 --num-of-optimizations 200 --watch");
        console.log("--constructor-args", vm.toString(abi.encode(CARV_NFT_NAME, CARV_NFT_SYMBOL)));
        console.log("--etherscan-api-key $ETHERSCAN_API_KEY");
        console.log(vm.toString(address(carvIdNFT)));
        console.log("src/CarvIdNFT.sol:CarvIdNFT");
        console.log("");
        console.log("To verify MedicalResearchResults contract, run:");
        console.log("forge verify-contract --chain-id 11155111 --num-of-optimizations 200 --watch");
        console.log("--etherscan-api-key $ETHERSCAN_API_KEY");
        console.log(vm.toString(address(medicalResearchResults)));
        console.log("src/MedicalResearchResults.sol:MedicalResearchResults");
        console.log("=======================================");
        
        // Setup demo data for testing
        console.log("\n=== Setting up Demo Data ===");
        vm.startBroadcast(deployerPrivateKey);
        
        // Mint a demo NFT
        uint256 demoTokenId = 1;
        string memory demoTokenUri = "https://gateway.pinata.cloud/ipfs/QmExample123/metadata.json";
        carvIdNFT.mint(deployer, demoTokenId, demoTokenUri);
        console.log("Demo NFT minted with ID:", demoTokenId);
        
        // Grant access to a demo agent
        address demoAgent = 0x742d35cc6634c0532925a3B8d73C3D0F6629c23d; // Sample agent address
        bytes32 drugDiscoveryDataType = keccak256("drug_discovery_data");
        carvIdNFT.grantAccess(demoTokenId, demoAgent, drugDiscoveryDataType);
        console.log("Demo access granted to agent:", demoAgent);
        
        // Submit a demo research result
        medicalResearchResults.submitAggregatedResult(
            "alzheimer_treatment_study",
            keccak256("demo_research_result_hash_12345"),
            95, // 95% accuracy
            demoAgent
        );
        console.log("Demo research result submitted");
        
        vm.stopBroadcast();
        
        // Final deployment summary
        console.log("\n========== DEPLOYMENT SUMMARY ==========");
        console.log("Network: Sepolia Testnet");
        console.log("Deployer:", deployer);
        console.log("Block Number:", block.number);
        console.log("Timestamp:", block.timestamp);
        console.log("");
        console.log("CONTRACT ADDRESSES:");
        console.log("CarvIdNFT:", address(carvIdNFT));
        console.log("MedicalResearchResults:", address(medicalResearchResults));
        console.log("");
        console.log("SEPOLIA ETHERSCAN LINKS:");
        console.log("CarvIdNFT:", string.concat("https://sepolia.etherscan.io/address/", vm.toString(address(carvIdNFT))));
        console.log("MedicalResearchResults:", string.concat("https://sepolia.etherscan.io/address/", vm.toString(address(medicalResearchResults))));
        console.log("");
        console.log("DEMO DATA:");
        console.log("Demo Token ID:", demoTokenId);
        console.log("Demo Token URI:", demoTokenUri);
        console.log("Demo Agent:", demoAgent);
        console.log("Demo Research Topic: alzheimer_treatment_study");
        console.log("Demo Accuracy: 95%");
        console.log("");
        
        // Verify demo data
        console.log("VERIFICATION:");
        console.log("Token exists:", carvIdNFT.ownerOf(demoTokenId) == deployer);
        console.log("Agent has access:", carvIdNFT.hasAccess(demoTokenId, demoAgent, drugDiscoveryDataType));
        
        (bytes32 resultHash, uint256 accuracy) = medicalResearchResults.getResearchResult("alzheimer_treatment_study", demoAgent);
        console.log("Research result stored:", resultHash != bytes32(0));
        console.log("Research accuracy:", accuracy);
        
        console.log("========================================");
        console.log("Deployment and verification complete!");
        console.log("Save these addresses for your frontend:");
        console.log("   CarvIdNFT:", address(carvIdNFT));
        console.log("   MedicalResearchResults:", address(medicalResearchResults));
        console.log("========================================");
    }
    
    // Helper function to convert address to string
    function addressToString(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3+i*2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
}
