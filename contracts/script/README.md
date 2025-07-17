# Medical Research App Deployment Scripts

This directory contains Foundry deployment scripts for the Medical Research App contracts.

## Prerequisites

1. Make sure you have Foundry installed
2. Set up your environment variables (for testnet/mainnet deployments)
3. Ensure you have the necessary dependencies installed

## Scripts Available

### 1. DeployLocal.s.sol
- **Purpose**: Deploy contracts to local Anvil network
- **Usage**: For local development and testing
- **Command**: `forge script script/DeployLocal.s.sol --rpc-url http://localhost:8545 --broadcast`

### 2. DeployMedicalResearch.s.sol
- **Purpose**: Deploy contracts to testnet/mainnet
- **Usage**: Production deployment
- **Command**: `forge script script/DeployMedicalResearch.s.sol --rpc-url $RPC_URL --broadcast --verify`

### 3. DeployAndSetupMedicalResearch.s.sol
- **Purpose**: Deploy contracts and set up demo data
- **Usage**: For testing with pre-configured demo data
- **Command**: `forge script script/DeployAndSetupMedicalResearch.s.sol --rpc-url $RPC_URL --broadcast`

## Environment Variables

Create a `.env` file in the project root with:

```bash
PRIVATE_KEY=0x...
RPC_URL=https://...
ETHERSCAN_API_KEY=...
```

## Deployment Commands

### Local Development (Anvil)
```bash
# Start local Anvil node
anvil

# Deploy to local network
forge script script/DeployLocal.s.sol --rpc-url http://localhost:8545 --broadcast
```

### Testnet Deployment (e.g., Sepolia)
```bash
# Load environment variables
source .env

# Deploy to testnet
forge script script/DeployMedicalResearch.s.sol --rpc-url $RPC_URL --broadcast --verify

# Or deploy with demo setup
forge script script/DeployAndSetupMedicalResearch.s.sol --rpc-url $RPC_URL --broadcast
```

### Mainnet Deployment
```bash
# Load environment variables
source .env

# Deploy to mainnet (use with caution)
forge script script/DeployMedicalResearch.s.sol --rpc-url $RPC_URL --broadcast --verify
```

## Contract Addresses

After deployment, the script will output the contract addresses. Save these for your frontend application:

- **CarvIdNFT**: `0x...`
- **MedicalResearchResults**: `0x...`

## Verification

If you want to verify contracts on Etherscan manually:

```bash
forge verify-contract --chain-id 1 --num-of-optimizations 200 --watch --constructor-args $(cast abi-encode "constructor(string,string)" "Medical Research CARV ID" "MRCID") CONTRACT_ADDRESS src/CarvIdNFT.sol:CarvIdNFT

forge verify-contract --chain-id 1 --num-of-optimizations 200 --watch CONTRACT_ADDRESS src/MedicalResearchResults.sol:MedicalResearchResults
```

## Post-Deployment

After deployment, you can:
1. Mint CARV ID NFTs to users
2. Grant data access permissions to AI agents
3. Submit research results through the MedicalResearchResults contract
4. Query access permissions and research results

## Example Usage

```javascript
// Example interaction with deployed contracts
const carvIdNFT = new ethers.Contract(CARV_ID_ADDRESS, CarvIdNFT_ABI, signer);
const medicalResults = new ethers.Contract(MEDICAL_RESULTS_ADDRESS, MedicalResults_ABI, signer);

// Mint NFT
await carvIdNFT.mint(userAddress, tokenId, metadataURI);

// Grant access
const dataTypeHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("drug_discovery_data"));
await carvIdNFT.grantAccess(tokenId, agentAddress, dataTypeHash);

// Submit research result
await medicalResults.submitAggregatedResult(
    "alzheimer_treatment",
    resultHash,
    95,
    agentAddress
);
```
