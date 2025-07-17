// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MedicalResearchResults.sol";

contract MedicalResearchResultsTest is Test {
    MedicalResearchResults public medicalResearchResults;
    
    address public admin;
    address public agent1;
    address public agent2;
    address public agent3;
    address public unauthorized;
    
    string public constant RESEARCH_TOPIC_1 = "alzheimer_treatment";
    string public constant RESEARCH_TOPIC_2 = "cancer_immunotherapy";
    string public constant RESEARCH_TOPIC_3 = "diabetes_prevention";
    string public constant EMPTY_TOPIC = "";
    
    bytes32 public constant RESULT_HASH_1 = keccak256("research_result_data_1");
    bytes32 public constant RESULT_HASH_2 = keccak256("research_result_data_2");
    bytes32 public constant RESULT_HASH_3 = keccak256("research_result_data_3");
    bytes32 public constant EMPTY_HASH = bytes32(0);
    
    uint256 public constant ACCURACY_HIGH = 95;
    uint256 public constant ACCURACY_MEDIUM = 75;
    uint256 public constant ACCURACY_LOW = 45;
    uint256 public constant ACCURACY_ZERO = 0;
    uint256 public constant ACCURACY_MAX = 100;
    uint256 public constant ACCURACY_OVER_MAX = 150;

    event ResearchResultSubmitted(
        string indexed researchTopic,
        bytes32 indexed resultHash,
        uint256 accuracy,
        address indexed agentAddress
    );

    function setUp() public {
        admin = address(this);
        agent1 = makeAddr("agent1");
        agent2 = makeAddr("agent2");
        agent3 = makeAddr("agent3");
        unauthorized = makeAddr("unauthorized");
        
        medicalResearchResults = new MedicalResearchResults();
    }

    // ============ Submit Aggregated Result Tests ============
    
    function test_SubmitAggregatedResult_Success() public {
        vm.expectEmit(true, true, false, true);
        emit ResearchResultSubmitted(RESEARCH_TOPIC_1, RESULT_HASH_1, ACCURACY_HIGH, agent1);
        
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_1,
            ACCURACY_HIGH,
            agent1
        );
        
        (bytes32 resultHash, uint256 accuracy) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_1, agent1);
        assertEq(resultHash, RESULT_HASH_1);
        assertEq(accuracy, ACCURACY_HIGH);
    }

    function test_SubmitAggregatedResult_MultipleAgents() public {
        // Agent 1 submits result
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_1,
            ACCURACY_HIGH,
            agent1
        );
        
        // Agent 2 submits result for same topic
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_2,
            ACCURACY_MEDIUM,
            agent2
        );
        
        // Verify both results are stored separately
        (bytes32 resultHash1, uint256 accuracy1) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_1, agent1);
        (bytes32 resultHash2, uint256 accuracy2) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_1, agent2);
        
        assertEq(resultHash1, RESULT_HASH_1);
        assertEq(accuracy1, ACCURACY_HIGH);
        assertEq(resultHash2, RESULT_HASH_2);
        assertEq(accuracy2, ACCURACY_MEDIUM);
    }

    function test_SubmitAggregatedResult_MultipleTopics() public {
        // Agent 1 submits for different topics
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_1,
            ACCURACY_HIGH,
            agent1
        );
        
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_2,
            RESULT_HASH_2,
            ACCURACY_MEDIUM,
            agent1
        );
        
        // Verify both results are stored separately
        (bytes32 resultHash1, uint256 accuracy1) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_1, agent1);
        (bytes32 resultHash2, uint256 accuracy2) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_2, agent1);
        
        assertEq(resultHash1, RESULT_HASH_1);
        assertEq(accuracy1, ACCURACY_HIGH);
        assertEq(resultHash2, RESULT_HASH_2);
        assertEq(accuracy2, ACCURACY_MEDIUM);
    }

    function test_SubmitAggregatedResult_UpdateExisting() public {
        // Submit initial result
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_1,
            ACCURACY_LOW,
            agent1
        );
        
        // Update with new result
        vm.expectEmit(true, true, false, true);
        emit ResearchResultSubmitted(RESEARCH_TOPIC_1, RESULT_HASH_2, ACCURACY_HIGH, agent1);
        
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_2,
            ACCURACY_HIGH,
            agent1
        );
        
        // Verify updated result
        (bytes32 resultHash, uint256 accuracy) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_1, agent1);
        assertEq(resultHash, RESULT_HASH_2);
        assertEq(accuracy, ACCURACY_HIGH);
    }

    function test_SubmitAggregatedResult_WithZeroAccuracy() public {
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_1,
            ACCURACY_ZERO,
            agent1
        );
        
        (bytes32 resultHash, uint256 accuracy) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_1, agent1);
        assertEq(resultHash, RESULT_HASH_1);
        assertEq(accuracy, ACCURACY_ZERO);
    }

    function test_SubmitAggregatedResult_WithMaxAccuracy() public {
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_1,
            ACCURACY_MAX,
            agent1
        );
        
        (bytes32 resultHash, uint256 accuracy) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_1, agent1);
        assertEq(resultHash, RESULT_HASH_1);
        assertEq(accuracy, ACCURACY_MAX);
    }

    function test_SubmitAggregatedResult_WithOverMaxAccuracy() public {
        // Contract doesn't validate accuracy range, so this should work
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_1,
            ACCURACY_OVER_MAX,
            agent1
        );
        
        (bytes32 resultHash, uint256 accuracy) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_1, agent1);
        assertEq(resultHash, RESULT_HASH_1);
        assertEq(accuracy, ACCURACY_OVER_MAX);
    }

    function test_SubmitAggregatedResult_WithEmptyTopic() public {
        medicalResearchResults.submitAggregatedResult(
            EMPTY_TOPIC,
            RESULT_HASH_1,
            ACCURACY_HIGH,
            agent1
        );
        
        (bytes32 resultHash, uint256 accuracy) = medicalResearchResults.getResearchResult(EMPTY_TOPIC, agent1);
        assertEq(resultHash, RESULT_HASH_1);
        assertEq(accuracy, ACCURACY_HIGH);
    }

    function test_SubmitAggregatedResult_WithEmptyHash() public {
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            EMPTY_HASH,
            ACCURACY_HIGH,
            agent1
        );
        
        (bytes32 resultHash, uint256 accuracy) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_1, agent1);
        assertEq(resultHash, EMPTY_HASH);
        assertEq(accuracy, ACCURACY_HIGH);
    }

    function test_SubmitAggregatedResult_WithZeroAddress() public {
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_1,
            ACCURACY_HIGH,
            address(0)
        );
        
        (bytes32 resultHash, uint256 accuracy) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_1, address(0));
        assertEq(resultHash, RESULT_HASH_1);
        assertEq(accuracy, ACCURACY_HIGH);
    }

    function test_SubmitAggregatedResult_EventEmission() public {
        vm.expectEmit(true, true, false, true);
        emit ResearchResultSubmitted(RESEARCH_TOPIC_1, RESULT_HASH_1, ACCURACY_HIGH, agent1);
        
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_1,
            ACCURACY_HIGH,
            agent1
        );
    }

    function test_SubmitAggregatedResult_MultipleEvents() public {
        // First submission
        vm.expectEmit(true, true, false, true);
        emit ResearchResultSubmitted(RESEARCH_TOPIC_1, RESULT_HASH_1, ACCURACY_HIGH, agent1);
        
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_1,
            ACCURACY_HIGH,
            agent1
        );
        
        // Second submission
        vm.expectEmit(true, true, false, true);
        emit ResearchResultSubmitted(RESEARCH_TOPIC_2, RESULT_HASH_2, ACCURACY_MEDIUM, agent2);
        
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_2,
            RESULT_HASH_2,
            ACCURACY_MEDIUM,
            agent2
        );
    }

    // ============ Get Research Result Tests ============
    
    function test_GetResearchResult_Success() public {
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_1,
            ACCURACY_HIGH,
            agent1
        );
        
        (bytes32 resultHash, uint256 accuracy) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_1, agent1);
        assertEq(resultHash, RESULT_HASH_1);
        assertEq(accuracy, ACCURACY_HIGH);
    }

    function test_GetResearchResult_NonExistentResult() public {
        (bytes32 resultHash, uint256 accuracy) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_1, agent1);
        assertEq(resultHash, bytes32(0));
        assertEq(accuracy, 0);
    }

    function test_GetResearchResult_DifferentAgents() public {
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_1,
            ACCURACY_HIGH,
            agent1
        );
        
        // Agent1 has result
        (bytes32 resultHash1, uint256 accuracy1) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_1, agent1);
        assertEq(resultHash1, RESULT_HASH_1);
        assertEq(accuracy1, ACCURACY_HIGH);
        
        // Agent2 has no result
        (bytes32 resultHash2, uint256 accuracy2) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_1, agent2);
        assertEq(resultHash2, bytes32(0));
        assertEq(accuracy2, 0);
    }

    function test_GetResearchResult_DifferentTopics() public {
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_1,
            ACCURACY_HIGH,
            agent1
        );
        
        // Same agent, different topic
        (bytes32 resultHash1, uint256 accuracy1) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_1, agent1);
        assertEq(resultHash1, RESULT_HASH_1);
        assertEq(accuracy1, ACCURACY_HIGH);
        
        (bytes32 resultHash2, uint256 accuracy2) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_2, agent1);
        assertEq(resultHash2, bytes32(0));
        assertEq(accuracy2, 0);
    }

    function test_GetResearchResult_PublicMapping() public {
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_1,
            ACCURACY_HIGH,
            agent1
        );
        
        // Test direct mapping access
        (bytes32 resultHash, uint256 accuracy) = medicalResearchResults.researchResults(RESEARCH_TOPIC_1, agent1);
        assertEq(resultHash, RESULT_HASH_1);
        assertEq(accuracy, ACCURACY_HIGH);
    }

    // ============ Integration Tests ============
    
    function test_Integration_CompleteWorkflow() public {
        // Multiple agents submit results for the same topic
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_1,
            ACCURACY_HIGH,
            agent1
        );
        
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_2,
            ACCURACY_MEDIUM,
            agent2
        );
        
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_3,
            ACCURACY_LOW,
            agent3
        );
        
        // Verify all results are stored correctly
        (bytes32 hash1, uint256 acc1) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_1, agent1);
        (bytes32 hash2, uint256 acc2) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_1, agent2);
        (bytes32 hash3, uint256 acc3) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_1, agent3);
        
        assertEq(hash1, RESULT_HASH_1);
        assertEq(acc1, ACCURACY_HIGH);
        assertEq(hash2, RESULT_HASH_2);
        assertEq(acc2, ACCURACY_MEDIUM);
        assertEq(hash3, RESULT_HASH_3);
        assertEq(acc3, ACCURACY_LOW);
    }

    function test_Integration_MultipleTopicsMultipleAgents() public {
        // Agent1 submits for multiple topics
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_1,
            ACCURACY_HIGH,
            agent1
        );
        
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_2,
            RESULT_HASH_2,
            ACCURACY_MEDIUM,
            agent1
        );
        
        // Agent2 submits for different topics
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_2,
            RESULT_HASH_3,
            ACCURACY_LOW,
            agent2
        );
        
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_3,
            RESULT_HASH_1,
            ACCURACY_HIGH,
            agent2
        );
        
        // Verify all combinations
        (bytes32 hash1_1, uint256 acc1_1) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_1, agent1);
        (bytes32 hash1_2, uint256 acc1_2) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_2, agent1);
        (bytes32 hash2_2, uint256 acc2_2) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_2, agent2);
        (bytes32 hash2_3, uint256 acc2_3) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_3, agent2);
        
        assertEq(hash1_1, RESULT_HASH_1);
        assertEq(acc1_1, ACCURACY_HIGH);
        assertEq(hash1_2, RESULT_HASH_2);
        assertEq(acc1_2, ACCURACY_MEDIUM);
        assertEq(hash2_2, RESULT_HASH_3);
        assertEq(acc2_2, ACCURACY_LOW);
        assertEq(hash2_3, RESULT_HASH_1);
        assertEq(acc2_3, ACCURACY_HIGH);
    }

    function test_Integration_UpdateAndRetrieve() public {
        // Initial submission
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_1,
            ACCURACY_LOW,
            agent1
        );
        
        (bytes32 initialHash, uint256 initialAccuracy) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_1, agent1);
        assertEq(initialHash, RESULT_HASH_1);
        assertEq(initialAccuracy, ACCURACY_LOW);
        
        // Update with better result
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_2,
            ACCURACY_HIGH,
            agent1
        );
        
        (bytes32 updatedHash, uint256 updatedAccuracy) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_1, agent1);
        assertEq(updatedHash, RESULT_HASH_2);
        assertEq(updatedAccuracy, ACCURACY_HIGH);
    }

    // ============ Edge Cases ============
    
    function test_EdgeCase_VeryLongTopicName() public {
        string memory longTopic = "this_is_a_very_long_research_topic_name_that_might_cause_issues_in_some_implementations_but_should_work_fine_in_solidity_mappings";
        
        medicalResearchResults.submitAggregatedResult(
            longTopic,
            RESULT_HASH_1,
            ACCURACY_HIGH,
            agent1
        );
        
        (bytes32 resultHash, uint256 accuracy) = medicalResearchResults.getResearchResult(longTopic, agent1);
        assertEq(resultHash, RESULT_HASH_1);
        assertEq(accuracy, ACCURACY_HIGH);
    }

    function test_EdgeCase_SpecialCharactersInTopic() public {
        string memory specialTopic = "test-topic_with.special@characters#123";
        
        medicalResearchResults.submitAggregatedResult(
            specialTopic,
            RESULT_HASH_1,
            ACCURACY_HIGH,
            agent1
        );
        
        (bytes32 resultHash, uint256 accuracy) = medicalResearchResults.getResearchResult(specialTopic, agent1);
        assertEq(resultHash, RESULT_HASH_1);
        assertEq(accuracy, ACCURACY_HIGH);
    }

    function test_EdgeCase_MaxUint256Accuracy() public {
        uint256 maxAccuracy = type(uint256).max;
        
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_1,
            maxAccuracy,
            agent1
        );
        
        (bytes32 resultHash, uint256 accuracy) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_1, agent1);
        assertEq(resultHash, RESULT_HASH_1);
        assertEq(accuracy, maxAccuracy);
    }

    function test_EdgeCase_SameHashDifferentAccuracy() public {
        // Same hash, different accuracy for same agent/topic (should update)
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_1,
            ACCURACY_LOW,
            agent1
        );
        
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_1,
            ACCURACY_HIGH,
            agent1
        );
        
        (bytes32 resultHash, uint256 accuracy) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_1, agent1);
        assertEq(resultHash, RESULT_HASH_1);
        assertEq(accuracy, ACCURACY_HIGH);
    }

    // ============ Gas Optimization Tests ============
    
    function test_GasUsage_SingleSubmission() public {
        uint256 gasBefore = gasleft();
        
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_1,
            ACCURACY_HIGH,
            agent1
        );
        
        uint256 gasUsed = gasBefore - gasleft();
        
        // Log gas usage for reference
        emit log_named_uint("Gas used for single submission", gasUsed);
        
        // Verify the result was stored
        (bytes32 resultHash, uint256 accuracy) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_1, agent1);
        assertEq(resultHash, RESULT_HASH_1);
        assertEq(accuracy, ACCURACY_HIGH);
    }

    function test_GasUsage_UpdateExisting() public {
        // Initial submission
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_1,
            ACCURACY_LOW,
            agent1
        );
        
        uint256 gasBefore = gasleft();
        
        // Update existing
        medicalResearchResults.submitAggregatedResult(
            RESEARCH_TOPIC_1,
            RESULT_HASH_2,
            ACCURACY_HIGH,
            agent1
        );
        
        uint256 gasUsed = gasBefore - gasleft();
        
        // Log gas usage for reference
        emit log_named_uint("Gas used for update", gasUsed);
        
        // Verify the result was updated
        (bytes32 resultHash, uint256 accuracy) = medicalResearchResults.getResearchResult(RESEARCH_TOPIC_1, agent1);
        assertEq(resultHash, RESULT_HASH_2);
        assertEq(accuracy, ACCURACY_HIGH);
    }
}
