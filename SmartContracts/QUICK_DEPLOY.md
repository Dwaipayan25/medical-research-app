# Quick Deployment to Sepolia

## One-Command Deployment

```bash
# 1. Set up environment
cp .env.example .env
# Edit .env with your PRIVATE_KEY, RPC_URL, and ETHERSCAN_API_KEY

# 2. Deploy to Sepolia
source .env && forge script script/DeploySepoliaAndVerify.s.sol --rpc-url $RPC_URL --broadcast --verify --etherscan-api-key $ETHERSCAN_API_KEY
```

## Manual Verification (if needed)

```bash
# Make script executable
chmod +x verify_contracts.sh

# Run verification script
./verify_contracts.sh
```

## Expected Deployment Output

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
```

## Files Created

- ✅ `script/DeploySepoliaAndVerify.s.sol` - Main deployment script
- ✅ `verify_contracts.sh` - Manual verification script
- ✅ `DEPLOYMENT_GUIDE.md` - Comprehensive deployment guide
- ✅ `.env.example` - Environment variable template

## What the Script Does

1. **Validates Environment**: Checks Sepolia chain ID and ETH balance
2. **Deploys Contracts**: Deploys both CarvIdNFT and MedicalResearchResults
3. **Creates Demo Data**: Mints sample NFT and sets up test permissions
4. **Provides Verification Instructions**: Shows commands for manual verification
5. **Output Summary**: Displays all important addresses and links

## Security Features

- ✅ Chain ID validation (ensures Sepolia deployment)
- ✅ Balance checks (ensures sufficient ETH)
- ✅ Deterministic deployment (uses CREATE2 with salt)
- ✅ Comprehensive logging
- ✅ Demo data for testing

Ready to deploy! 🚀
