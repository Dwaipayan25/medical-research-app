// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// This contract simulates a simplified CARV ID (ERC-7231 like) for patient identity
// and granular data access permissions.
// ERC-7731 is an extension of ERC-721, so we build on ERC-721.
contract CarvIdNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 public _tokenIdCounter;

    // Mapping to store which agent has access to which data type for a given tokenId
    // tokenId => agentAddress => dataTypeHash => hasAccess (bool)
    mapping(uint256 => mapping(address => mapping(bytes32 => bool))) public dataAccessPermissions;

    event AccessGranted(uint256 indexed tokenId, address indexed agentAddress, bytes32 indexed dataTypeHash);
    event AccessRevoked(uint256 indexed tokenId, address indexed agentAddress, bytes32 indexed dataTypeHash);

    constructor(string memory name, string memory symbol) ERC721(name, symbol) Ownable(msg.sender) {}

    // Function to mint a new CARV ID NFT to a patient (user)
    // In a real system, this might have more complex logic (e.g., linked to Web2 identity)
    function mint(address to, uint256 tokenId, string memory uri) public {
        require(to != address(0), "ERC721: mint to the zero address");
        require(_ownerOf(tokenId) == address(0), "ERC721: token already minted");
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _tokenIdCounter = _tokenIdCounter + 1;
    }

    // Allows the owner of a CARV ID NFT to grant an AI agent access to a specific data type
    // dataTypeHash is a keccak256 hash of the data type string (e.g., keccak256("drug_discovery_data"))
    function grantAccess(uint256 tokenId, address agentAddress, bytes32 dataTypeHash) public {
        require(_isAuthorized(ownerOf(tokenId), msg.sender, tokenId), "CarvIdNFT: Caller is not owner nor approved");
        require(agentAddress != address(0), "CarvIdNFT: Agent address cannot be zero");

        dataAccessPermissions[tokenId][agentAddress][dataTypeHash] = true;
        emit AccessGranted(tokenId, agentAddress, dataTypeHash);
    }

    // Allows the owner of a CARV ID NFT to revoke an AI agent's access to a specific data type
    function revokeAccess(uint256 tokenId, address agentAddress, bytes32 dataTypeHash) public {
        require(_isAuthorized(ownerOf(tokenId), msg.sender, tokenId), "CarvIdNFT: Caller is not owner nor approved");
        require(agentAddress != address(0), "CarvIdNFT: Agent address cannot be zero");

        dataAccessPermissions[tokenId][agentAddress][dataTypeHash] = false;
        emit AccessRevoked(tokenId, agentAddress, dataTypeHash);
    }

    // Checks if a given AI agent has access to a specific data type for a given CARV ID NFT
    function hasAccess(uint256 tokenId, address agentAddress, bytes32 dataTypeHash) public view returns (bool) {
        return dataAccessPermissions[tokenId][agentAddress][dataTypeHash];
    }

    // Required overrides for ERC721URIStorage
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}