// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// This contract stores aggregated, anonymized research results submitted by AI agents.
contract MedicalResearchResults {
    // researchTopic => agentAddress => {resultHash, accuracy}
    mapping(string => mapping(address => Result)) public researchResults;

    struct Result {
        bytes32 resultHash;
        uint256 accuracy;
    }

    event ResearchResultSubmitted(
        string indexed researchTopic,
        bytes32 indexed resultHash,
        uint256 accuracy,
        address indexed agentAddress
    );

    // Allows an AI agent to submit an aggregated research result.
    // In a real system, this might include more complex verification (e.g., ZK proofs).
    function submitAggregatedResult(
        string memory researchTopic,
        bytes32 resultHash,
        uint256 accuracy,
        address agentAddress
    ) public {
        // In a production system, you'd add authentication here
        // e.g., require(msg.sender == agentAddress, "Only the submitting agent can call this.");
        // or require(isAuthorizedAgent(msg.sender), "Caller is not an authorized agent.");

        researchResults[researchTopic][agentAddress] = Result(resultHash, accuracy);

        emit ResearchResultSubmitted(researchTopic, resultHash, accuracy, agentAddress);
    }

    // Retrieves a specific research result by topic and agent.
    function getResearchResult(string memory researchTopic, address agentAddress)
        public
        view
        returns (bytes32 resultHash, uint256 accuracy)
    {
        Result storage res = researchResults[researchTopic][agentAddress];
        return (res.resultHash, res.accuracy);
    }
}