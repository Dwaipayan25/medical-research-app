// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/CarvIdNFT.sol";

contract CarvIdNFTTest is Test {
    CarvIdNFT public carvIdNFT;
    
    address public owner;
    address public patient1;
    address public patient2;
    address public agent1;
    address public agent2;
    address public unauthorized;
    
    uint256 public constant TOKEN_ID_1 = 1;
    uint256 public constant TOKEN_ID_2 = 2;
    
    string public constant TOKEN_URI_1 = "https://example.com/metadata/1";
    string public constant TOKEN_URI_2 = "https://example.com/metadata/2";
    
    bytes32 public constant DRUG_DISCOVERY_DATA = keccak256("drug_discovery_data");
    bytes32 public constant GENETIC_DATA = keccak256("genetic_data");
    bytes32 public constant CLINICAL_TRIAL_DATA = keccak256("clinical_trial_data");

    event AccessGranted(uint256 indexed tokenId, address indexed agentAddress, bytes32 indexed dataTypeHash);
    event AccessRevoked(uint256 indexed tokenId, address indexed agentAddress, bytes32 indexed dataTypeHash);

    function setUp() public {
        owner = address(this);
        patient1 = makeAddr("patient1");
        patient2 = makeAddr("patient2");
        agent1 = makeAddr("agent1");
        agent2 = makeAddr("agent2");
        unauthorized = makeAddr("unauthorized");
        
        carvIdNFT = new CarvIdNFT("Medical Research CARV ID", "MRCID");
    }

    // ============ Constructor Tests ============
    
    function test_Constructor() public {
        assertEq(carvIdNFT.name(), "Medical Research CARV ID");
        assertEq(carvIdNFT.symbol(), "MRCID");
        assertEq(carvIdNFT.owner(), owner);
        assertEq(carvIdNFT.tokenIdCounter(), 0);
    }

    // ============ Mint Function Tests ============
    
    function test_Mint_Success() public {
        carvIdNFT.mint(patient1, TOKEN_ID_1, TOKEN_URI_1);
        
        assertEq(carvIdNFT.ownerOf(TOKEN_ID_1), patient1);
        assertEq(carvIdNFT.tokenURI(TOKEN_ID_1), TOKEN_URI_1);
        assertEq(carvIdNFT.tokenIdCounter(), 1);
    }

    function test_Mint_MultipleTokens() public {
        carvIdNFT.mint(patient1, TOKEN_ID_1, TOKEN_URI_1);
        carvIdNFT.mint(patient2, TOKEN_ID_2, TOKEN_URI_2);
        
        assertEq(carvIdNFT.ownerOf(TOKEN_ID_1), patient1);
        assertEq(carvIdNFT.ownerOf(TOKEN_ID_2), patient2);
        assertEq(carvIdNFT.tokenIdCounter(), 2);
    }

    function test_Mint_RevertWhen_ZeroAddress() public {
        vm.expectRevert("ERC721: mint to the zero address");
        carvIdNFT.mint(address(0), TOKEN_ID_1, TOKEN_URI_1);
    }

    function test_Mint_RevertWhen_TokenAlreadyExists() public {
        carvIdNFT.mint(patient1, TOKEN_ID_1, TOKEN_URI_1);
        
        vm.expectRevert("ERC721: token already minted");
        carvIdNFT.mint(patient2, TOKEN_ID_1, TOKEN_URI_2);
    }

    // ============ Grant Access Tests ============
    
    function test_GrantAccess_Success_ByOwner() public {
        carvIdNFT.mint(patient1, TOKEN_ID_1, TOKEN_URI_1);
        
        vm.prank(patient1);
        vm.expectEmit(true, true, true, true);
        emit AccessGranted(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA);
        carvIdNFT.grantAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA);
        
        assertTrue(carvIdNFT.hasAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA));
    }

    function test_GrantAccess_Success_ByApproved() public {
        carvIdNFT.mint(patient1, TOKEN_ID_1, TOKEN_URI_1);
        
        vm.prank(patient1);
        carvIdNFT.approve(agent1, TOKEN_ID_1);
        
        vm.prank(agent1);
        carvIdNFT.grantAccess(TOKEN_ID_1, agent2, DRUG_DISCOVERY_DATA);
        
        assertTrue(carvIdNFT.hasAccess(TOKEN_ID_1, agent2, DRUG_DISCOVERY_DATA));
    }

    function test_GrantAccess_Success_ByApprovedForAll() public {
        carvIdNFT.mint(patient1, TOKEN_ID_1, TOKEN_URI_1);
        
        vm.prank(patient1);
        carvIdNFT.setApprovalForAll(agent1, true);
        
        vm.prank(agent1);
        carvIdNFT.grantAccess(TOKEN_ID_1, agent2, DRUG_DISCOVERY_DATA);
        
        assertTrue(carvIdNFT.hasAccess(TOKEN_ID_1, agent2, DRUG_DISCOVERY_DATA));
    }

    function test_GrantAccess_MultipleDataTypes() public {
        carvIdNFT.mint(patient1, TOKEN_ID_1, TOKEN_URI_1);
        
        vm.startPrank(patient1);
        carvIdNFT.grantAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA);
        carvIdNFT.grantAccess(TOKEN_ID_1, agent1, GENETIC_DATA);
        carvIdNFT.grantAccess(TOKEN_ID_1, agent1, CLINICAL_TRIAL_DATA);
        vm.stopPrank();
        
        assertTrue(carvIdNFT.hasAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA));
        assertTrue(carvIdNFT.hasAccess(TOKEN_ID_1, agent1, GENETIC_DATA));
        assertTrue(carvIdNFT.hasAccess(TOKEN_ID_1, agent1, CLINICAL_TRIAL_DATA));
    }

    function test_GrantAccess_RevertWhen_NotOwnerOrApproved() public {
        carvIdNFT.mint(patient1, TOKEN_ID_1, TOKEN_URI_1);
        
        vm.prank(unauthorized);
        vm.expectRevert("CarvIdNFT: Caller is not owner nor approved");
        carvIdNFT.grantAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA);
    }

    function test_GrantAccess_RevertWhen_ZeroAgentAddress() public {
        carvIdNFT.mint(patient1, TOKEN_ID_1, TOKEN_URI_1);
        
        vm.prank(patient1);
        vm.expectRevert("CarvIdNFT: Agent address cannot be zero");
        carvIdNFT.grantAccess(TOKEN_ID_1, address(0), DRUG_DISCOVERY_DATA);
    }

    function test_GrantAccess_RevertWhen_TokenNotExists() public {
        vm.expectRevert("ERC721: invalid token ID");
        carvIdNFT.grantAccess(999, agent1, DRUG_DISCOVERY_DATA);
    }

    // ============ Revoke Access Tests ============
    
    function test_RevokeAccess_Success() public {
        carvIdNFT.mint(patient1, TOKEN_ID_1, TOKEN_URI_1);
        
        vm.startPrank(patient1);
        carvIdNFT.grantAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA);
        assertTrue(carvIdNFT.hasAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA));
        
        vm.expectEmit(true, true, true, true);
        emit AccessRevoked(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA);
        carvIdNFT.revokeAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA);
        vm.stopPrank();
        
        assertFalse(carvIdNFT.hasAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA));
    }

    function test_RevokeAccess_Success_ByApproved() public {
        carvIdNFT.mint(patient1, TOKEN_ID_1, TOKEN_URI_1);
        
        vm.prank(patient1);
        carvIdNFT.grantAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA);
        
        vm.prank(patient1);
        carvIdNFT.approve(agent2, TOKEN_ID_1);
        
        vm.prank(agent2);
        carvIdNFT.revokeAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA);
        
        assertFalse(carvIdNFT.hasAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA));
    }

    function test_RevokeAccess_PartialRevoke() public {
        carvIdNFT.mint(patient1, TOKEN_ID_1, TOKEN_URI_1);
        
        vm.startPrank(patient1);
        carvIdNFT.grantAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA);
        carvIdNFT.grantAccess(TOKEN_ID_1, agent1, GENETIC_DATA);
        
        // Revoke only one type of access
        carvIdNFT.revokeAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA);
        vm.stopPrank();
        
        assertFalse(carvIdNFT.hasAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA));
        assertTrue(carvIdNFT.hasAccess(TOKEN_ID_1, agent1, GENETIC_DATA));
    }

    function test_RevokeAccess_RevertWhen_NotOwnerOrApproved() public {
        carvIdNFT.mint(patient1, TOKEN_ID_1, TOKEN_URI_1);
        
        vm.prank(patient1);
        carvIdNFT.grantAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA);
        
        vm.prank(unauthorized);
        vm.expectRevert("CarvIdNFT: Caller is not owner nor approved");
        carvIdNFT.revokeAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA);
    }

    function test_RevokeAccess_RevertWhen_ZeroAgentAddress() public {
        carvIdNFT.mint(patient1, TOKEN_ID_1, TOKEN_URI_1);
        
        vm.prank(patient1);
        vm.expectRevert("CarvIdNFT: Agent address cannot be zero");
        carvIdNFT.revokeAccess(TOKEN_ID_1, address(0), DRUG_DISCOVERY_DATA);
    }

    // ============ HasAccess Tests ============
    
    function test_HasAccess_ReturnsFalse_WhenNotGranted() public {
        carvIdNFT.mint(patient1, TOKEN_ID_1, TOKEN_URI_1);
        
        assertFalse(carvIdNFT.hasAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA));
    }

    function test_HasAccess_ReturnsFalse_WhenRevoked() public {
        carvIdNFT.mint(patient1, TOKEN_ID_1, TOKEN_URI_1);
        
        vm.startPrank(patient1);
        carvIdNFT.grantAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA);
        carvIdNFT.revokeAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA);
        vm.stopPrank();
        
        assertFalse(carvIdNFT.hasAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA));
    }

    function test_HasAccess_DifferentAgents() public {
        carvIdNFT.mint(patient1, TOKEN_ID_1, TOKEN_URI_1);
        
        vm.prank(patient1);
        carvIdNFT.grantAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA);
        
        assertTrue(carvIdNFT.hasAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA));
        assertFalse(carvIdNFT.hasAccess(TOKEN_ID_1, agent2, DRUG_DISCOVERY_DATA));
    }

    function test_HasAccess_DifferentTokens() public {
        carvIdNFT.mint(patient1, TOKEN_ID_1, TOKEN_URI_1);
        carvIdNFT.mint(patient2, TOKEN_ID_2, TOKEN_URI_2);
        
        vm.prank(patient1);
        carvIdNFT.grantAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA);
        
        assertTrue(carvIdNFT.hasAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA));
        assertFalse(carvIdNFT.hasAccess(TOKEN_ID_2, agent1, DRUG_DISCOVERY_DATA));
    }

    function test_HasAccess_DifferentDataTypes() public {
        carvIdNFT.mint(patient1, TOKEN_ID_1, TOKEN_URI_1);
        
        vm.prank(patient1);
        carvIdNFT.grantAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA);
        
        assertTrue(carvIdNFT.hasAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA));
        assertFalse(carvIdNFT.hasAccess(TOKEN_ID_1, agent1, GENETIC_DATA));
    }

    // ============ ERC721 Override Tests ============
    
    function test_TokenURI_Success() public {
        carvIdNFT.mint(patient1, TOKEN_ID_1, TOKEN_URI_1);
        
        assertEq(carvIdNFT.tokenURI(TOKEN_ID_1), TOKEN_URI_1);
    }

    function test_TokenURI_RevertWhen_TokenNotExists() public {
        vm.expectRevert("ERC721: invalid token ID");
        carvIdNFT.tokenURI(999);
    }

    function test_SupportsInterface_ERC721() public {
        bytes4 erc721InterfaceId = 0x80ac58cd;
        assertTrue(carvIdNFT.supportsInterface(erc721InterfaceId));
    }

    function test_SupportsInterface_ERC721Metadata() public {
        bytes4 erc721MetadataInterfaceId = 0x5b5e139f;
        assertTrue(carvIdNFT.supportsInterface(erc721MetadataInterfaceId));
    }

    // ============ Integration Tests ============
    
    function test_Integration_CompleteWorkflow() public {
        // 1. Mint NFT to patient
        carvIdNFT.mint(patient1, TOKEN_ID_1, TOKEN_URI_1);
        assertEq(carvIdNFT.ownerOf(TOKEN_ID_1), patient1);
        
        // 2. Grant access to multiple agents for different data types
        vm.startPrank(patient1);
        carvIdNFT.grantAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA);
        carvIdNFT.grantAccess(TOKEN_ID_1, agent1, GENETIC_DATA);
        carvIdNFT.grantAccess(TOKEN_ID_1, agent2, CLINICAL_TRIAL_DATA);
        vm.stopPrank();
        
        // 3. Verify access permissions
        assertTrue(carvIdNFT.hasAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA));
        assertTrue(carvIdNFT.hasAccess(TOKEN_ID_1, agent1, GENETIC_DATA));
        assertTrue(carvIdNFT.hasAccess(TOKEN_ID_1, agent2, CLINICAL_TRIAL_DATA));
        assertFalse(carvIdNFT.hasAccess(TOKEN_ID_1, agent2, DRUG_DISCOVERY_DATA));
        
        // 4. Revoke some access
        vm.prank(patient1);
        carvIdNFT.revokeAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA);
        
        // 5. Verify updated permissions
        assertFalse(carvIdNFT.hasAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA));
        assertTrue(carvIdNFT.hasAccess(TOKEN_ID_1, agent1, GENETIC_DATA));
        assertTrue(carvIdNFT.hasAccess(TOKEN_ID_1, agent2, CLINICAL_TRIAL_DATA));
    }

    function test_Integration_ApprovalWorkflow() public {
        // 1. Mint NFT
        carvIdNFT.mint(patient1, TOKEN_ID_1, TOKEN_URI_1);
        
        // 2. Patient approves agent1 for this specific token
        vm.prank(patient1);
        carvIdNFT.approve(agent1, TOKEN_ID_1);
        
        // 3. Agent1 can now manage access permissions
        vm.prank(agent1);
        carvIdNFT.grantAccess(TOKEN_ID_1, agent2, DRUG_DISCOVERY_DATA);
        
        // 4. Verify access was granted
        assertTrue(carvIdNFT.hasAccess(TOKEN_ID_1, agent2, DRUG_DISCOVERY_DATA));
        
        // 5. Agent1 can also revoke access
        vm.prank(agent1);
        carvIdNFT.revokeAccess(TOKEN_ID_1, agent2, DRUG_DISCOVERY_DATA);
        
        // 6. Verify access was revoked
        assertFalse(carvIdNFT.hasAccess(TOKEN_ID_1, agent2, DRUG_DISCOVERY_DATA));
    }

    // ============ Edge Cases ============
    
    function test_EdgeCase_RevokeNonExistentAccess() public {
        carvIdNFT.mint(patient1, TOKEN_ID_1, TOKEN_URI_1);
        
        // Should not revert even if access was never granted
        vm.prank(patient1);
        carvIdNFT.revokeAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA);
        
        assertFalse(carvIdNFT.hasAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA));
    }

    function test_EdgeCase_GrantAccessTwice() public {
        carvIdNFT.mint(patient1, TOKEN_ID_1, TOKEN_URI_1);
        
        vm.startPrank(patient1);
        carvIdNFT.grantAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA);
        
        // Granting access twice should not cause issues
        carvIdNFT.grantAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA);
        vm.stopPrank();
        
        assertTrue(carvIdNFT.hasAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA));
    }

    function test_EdgeCase_SameAgentDifferentDataTypes() public {
        carvIdNFT.mint(patient1, TOKEN_ID_1, TOKEN_URI_1);
        
        vm.startPrank(patient1);
        carvIdNFT.grantAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA);
        carvIdNFT.grantAccess(TOKEN_ID_1, agent1, GENETIC_DATA);
        
        // Revoke one type
        carvIdNFT.revokeAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA);
        vm.stopPrank();
        
        assertFalse(carvIdNFT.hasAccess(TOKEN_ID_1, agent1, DRUG_DISCOVERY_DATA));
        assertTrue(carvIdNFT.hasAccess(TOKEN_ID_1, agent1, GENETIC_DATA));
    }
}
