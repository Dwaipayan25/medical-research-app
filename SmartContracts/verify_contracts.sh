#!/bin/bash

# Sepolia Contract Verification Script
# Usage: ./verify_contracts.sh

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Sepolia Contract Verification Script ===${NC}"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Please create a .env file with your ETHERSCAN_API_KEY"
    exit 1
fi

# Source environment variables
source .env

# Check if required environment variables are set
if [ -z "$ETHERSCAN_API_KEY" ]; then
    echo -e "${RED}Error: ETHERSCAN_API_KEY not set in .env file${NC}"
    exit 1
fi

# Prompt for contract addresses
echo -e "${YELLOW}Enter contract addresses from deployment:${NC}"
read -p "CarvIdNFT address: " CARV_NFT_ADDRESS
read -p "MedicalResearchResults address: " MEDICAL_RESULTS_ADDRESS

# Validate addresses
if [ -z "$CARV_NFT_ADDRESS" ] || [ -z "$MEDICAL_RESULTS_ADDRESS" ]; then
    echo -e "${RED}Error: Both contract addresses are required${NC}"
    exit 1
fi

echo -e "${YELLOW}Verifying contracts on Sepolia...${NC}"

# Verify CarvIdNFT
echo -e "${YELLOW}Verifying CarvIdNFT...${NC}"
forge verify-contract \
    --chain-id 11155111 \
    --num-of-optimizations 200 \
    --watch \
    --constructor-args $(cast abi-encode "constructor(string,string)" "Medical Research CARV ID" "MRCID") \
    --etherscan-api-key $ETHERSCAN_API_KEY \
    $CARV_NFT_ADDRESS \
    src/CarvIdNFT.sol:CarvIdNFT

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ CarvIdNFT verified successfully${NC}"
    echo -e "${GREEN}View on Etherscan: https://sepolia.etherscan.io/address/$CARV_NFT_ADDRESS${NC}"
else
    echo -e "${RED}✗ CarvIdNFT verification failed${NC}"
fi

echo ""

# Verify MedicalResearchResults
echo -e "${YELLOW}Verifying MedicalResearchResults...${NC}"
forge verify-contract \
    --chain-id 11155111 \
    --num-of-optimizations 200 \
    --watch \
    --etherscan-api-key $ETHERSCAN_API_KEY \
    $MEDICAL_RESULTS_ADDRESS \
    src/MedicalResearchResults.sol:MedicalResearchResults

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ MedicalResearchResults verified successfully${NC}"
    echo -e "${GREEN}View on Etherscan: https://sepolia.etherscan.io/address/$MEDICAL_RESULTS_ADDRESS${NC}"
else
    echo -e "${RED}✗ MedicalResearchResults verification failed${NC}"
fi

echo ""
echo -e "${YELLOW}=== Verification Complete ===${NC}"
echo -e "${GREEN}Contract addresses:${NC}"
echo -e "CarvIdNFT: $CARV_NFT_ADDRESS"
echo -e "MedicalResearchResults: $MEDICAL_RESULTS_ADDRESS"
