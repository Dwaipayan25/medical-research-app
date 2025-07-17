# Sepolia Deployment Guide

This guide explains how to deploy the Medical Research App contracts to Sepolia testnet.

## Prerequisites

1. **Foundry installed**
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Sepolia ETH**
   - Get testnet ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
   - Or use [Infura Sepolia Faucet](https://infura.io/faucet/sepolia)

3. **Etherscan API Key**
   - Get API key from [Etherscan](https://etherscan.io/apis)

## Environment Setup

1. **Create `.env` file in the project root:**
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your values:**
   ```bash
   # Your private key (without 0x prefix)
   PRIVATE_KEY=your_private_key_here
   
   # Sepolia RPC URL
   RPC_URL=https://sepolia.infura.io/v3/your-infura-key
   # or use Alchemy
   # RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-alchemy-key
   
   # Etherscan API key for verification
   ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

## Deployment Steps

### 1. Load Environment Variables
```bash
source .env
```

### 2. Deploy to Sepolia
```bash
forge script script/DeploySepoliaAndVerify.s.sol \
  --rpc-url $RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

### 3. Alternative: Deploy without auto-verification
```bash
forge script script/DeploySepoliaAndVerify.s.sol \
  --rpc-url $RPC_URL \
  --broadcast
```

## Manual Verification (if auto-verification fails)

After deployment, you can manually verify the contracts:

### Verify CarvIdNFT
```bash
forge verify-contract \
  --chain-id 11155111 \
  --num-of-optimizations 200 \
  --watch \
  --constructor-args $(cast abi-encode "constructor(string,string)" "Medical Research CARV ID" "MRCID") \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  YOUR_CARV_NFT_ADDRESS \
  src/CarvIdNFT.sol:CarvIdNFT
```

### Verify MedicalResearchResults
```bash
forge verify-contract \
  --chain-id 11155111 \
  --num-of-optimizations 200 \
  --watch \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  YOUR_MEDICAL_RESULTS_ADDRESS \
  src/MedicalResearchResults.sol:MedicalResearchResults
```

## Expected Output

After successful deployment, you should see:

```
========== DEPLOYMENT SUMMARY ==========
Network: Sepolia Testnet
Deployer: 0x1234...
Block Number: 12345678
Timestamp: 1704067200

CONTRACT ADDRESSES:
CarvIdNFT: 0xabcd...
MedicalResearchResults: 0xefgh...

SEPOLIA ETHERSCAN LINKS:
CarvIdNFT: https://sepolia.etherscan.io/address/0xabcd...
MedicalResearchResults: https://sepolia.etherscan.io/address/0xefgh...

DEMO DATA:
Demo Token ID: 1
Demo Token URI: https://gateway.pinata.cloud/ipfs/QmExample123/metadata.json
Demo Agent: 0x742d35cc6634c0532925a3B8d73C3D0F6629c23d
Demo Research Topic: alzheimer_treatment_study
Demo Accuracy: 95%

VERIFICATION:
Token exists: true
Agent has access: true
Research result stored: true
Research accuracy: 95
========================================
```

## Post-Deployment

1. **Save the contract addresses** for your frontend application
2. **Update your frontend configuration** with the deployed addresses
3. **Test the contracts** using the demo data
4. **Verify on Etherscan** that the contracts are properly verified

## Troubleshooting

### Common Issues

1. **"Insufficient ETH balance"**
   - Get more Sepolia ETH from faucets
   - Check your wallet balance

2. **"Transaction underpriced"**
   - Increase gas price in your RPC settings
   - Try again when network is less congested

3. **"Verification failed"**
   - Use manual verification commands
   - Check that all import paths are correct
   - Ensure compiler settings match

4. **"Invalid private key"**
   - Ensure private key is in correct format (no 0x prefix)
   - Check that the private key corresponds to an account with ETH

### Useful Commands

```bash
# Check deployer balance
cast balance --rpc-url $RPC_URL YOUR_ADDRESS

# Check gas price
cast gas-price --rpc-url $RPC_URL

# Check contract code
cast code --rpc-url $RPC_URL CONTRACT_ADDRESS

# Call contract function
cast call --rpc-url $RPC_URL CONTRACT_ADDRESS "name()"
```

## Security Notes

- Never commit your private key to version control
- Use separate wallets for testnet and mainnet
- Keep your `.env` file secure and never share it
- Consider using a hardware wallet for mainnet deployments

## Next Steps

After deployment:
1. Update your frontend with the contract addresses
2. Test all contract functions
3. Set up monitoring for your contracts
4. Consider deploying to mainnet when ready
