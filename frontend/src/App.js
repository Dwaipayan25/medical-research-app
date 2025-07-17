// No longer directly including script tags here.
// Assume ethers.js and marked.js are loaded globally by the environment
// (e.g., in the HTML file where this React app is mounted).

import React, { useState, useEffect } from 'react';

// --- Smart Contract ABIs and Addresses (PLACEHOLDERS - REPLACE WITH YOUR DEPLOYED VALUES) ---
// You will get these after deploying your Solidity contracts using Hardhat/Foundry
const CARV_ID_NFT_ABI = [
  // ERC-721 functions (transferFrom, ownerOf, balanceOf, approve, getApproved, setApprovalForAll, isApprovedForAll)
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function mint(address to, uint256 tokenId, string uri) public",
  "function grantAccess(uint256 tokenId, address agentAddress, bytes32 dataTypeHash) public",
  "function revokeAccess(uint256 tokenId, address agentAddress, bytes32 dataTypeHash) public",
  "function hasAccess(uint256 tokenId, address agentAddress, bytes32 dataTypeHash) view returns (bool)",
  "event AccessGranted(uint256 indexed tokenId, address indexed agentAddress, bytes32 indexed dataTypeHash)",
  "event AccessRevoked(uint256 indexed tokenId, address indexed agentAddress, bytes32 indexed dataTypeHash)"
];
const CARV_ID_NFT_ADDRESS = "YOUR_CARV_ID_NFT_CONTRACT_ADDRESS"; // e.g., "0x..."

const MEDICAL_RESEARCH_RESULTS_ABI = [
  "function submitAggregatedResult(string researchTopic, bytes32 resultHash, uint256 accuracy, address agentAddress) public",
  "function getResearchResult(string researchTopic, address agentAddress) view returns (bytes32 resultHash, uint256 accuracy)",
  "event ResearchResultSubmitted(string indexed researchTopic, bytes32 indexed resultHash, uint256 accuracy, address indexed agentAddress)"
];
const MEDICAL_RESEARCH_RESULTS_ADDRESS = "YOUR_MEDICAL_RESEARCH_RESULTS_CONTRACT_ADDRESS"; // e.g., "0x..."

// --- AI Agent (Off-chain Python) - Conceptual Interaction ---
// In a real scenario, this would be a Python backend service. For this demo,
// we'll simulate its "triggering" and assume it reports back.
// You would run your Python orchestrator.py script separately.

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [carvIdContract, setCarvIdContract] = useState(null);
  const [researchResultsContract, setResearchResultsContract] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [mintingId, setMintingId] = useState('');
  const [grantingId, setGrantingId] = useState('');
  const [grantAgentAddress, setGrantAgentAddress] = useState('');
  const [grantDataType, setGrantDataType] = useState('');
  const [retrievedResults, setRetrievedResults] = useState([]);
  const [isSvmAgentActive, setIsSvmAgentActive] = useState(false); // New state for SVM Agent mock
  const [summaryModalOpen, setSummaryModalOpen] = useState(false); // State for summary modal
  const [currentSummary, setCurrentSummary] = useState(''); // State for current summary text
  const [summaryLoading, setSummaryLoading] = useState(false); // State for summary loading
  const [nextStepsModalOpen, setNextStepsModalOpen] = useState(false); // State for next steps modal
  const [currentNextSteps, setCurrentNextSteps] = useState(''); // State for next steps text
  const [nextStepsLoading, setNextStepsLoading] = useState(false); // State for next steps loading
  const [explainTermModalOpen, setExplainTermModalOpen] = useState(false); // State for explain term modal
  const [medicalTerm, setMedicalTerm] = useState(''); // State for medical term input
  const [explainedTerm, setExplainedTerm] = useState(''); // State for explained term text
  const [explainTermLoading, setExplainTermLoading] = useState(false); // State for explain term loading


  // --- Web3 Initialization ---
  useEffect(() => {
    console.log('Checking Web3 availability:', {
      ethereum: !!window.ethereum,
      ethers: !!window.ethers,
      ethersProviders: !!(window.ethers && window.ethers.providers)
    });

    // Ensure window.ethers is available before proceeding
    if (window.ethereum && window.ethers && window.ethers.providers) {
      const ethProvider = new window.ethers.providers.Web3Provider(window.ethereum);
      setProvider(ethProvider);

      const checkConnection = async () => {
        try {
          // Check if already connected without requesting permission
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            // User is already connected, set up contracts
            const ethSigner = ethProvider.getSigner();
            const addr = await ethSigner.getAddress();
            setUserAddress(addr);
            setSigner(ethSigner);

            const carvId = new window.ethers.Contract(CARV_ID_NFT_ADDRESS, CARV_ID_NFT_ABI, ethSigner);
            setCarvIdContract(carvId);

            const research = new window.ethers.Contract(MEDICAL_RESEARCH_RESULTS_ADDRESS, MEDICAL_RESEARCH_RESULTS_ABI, ethSigner);
            setResearchResultsContract(research);

            setMessage("Connected to MetaMask and contracts.");
          } else {
            setMessage("Please connect your MetaMask wallet to continue.");
          }
        } catch (err) {
          console.error("Failed to check wallet connection:", err);
          setMessage("Please connect your MetaMask wallet to continue.");
        }
      };

      // Listen for account changes
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
          setSigner(ethProvider.getSigner());
          setMessage("Wallet connected successfully.");
        } else {
          setUserAddress(null);
          setSigner(null);
          setCarvIdContract(null);
          setResearchResultsContract(null);
          setMessage("Please connect your MetaMask wallet.");
        }
      };

      // Listen for chain changes
      const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      checkConnection();

      // Cleanup event listeners
      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    } else {
      console.error('Missing dependencies:', {
        ethereum: !window.ethereum,
        ethers: !window.ethers,
        ethersProviders: !(window.ethers && window.ethers.providers)
      });
      
      if (!window.ethereum) {
        setError("MetaMask is not installed. Please install MetaMask browser extension.");
      } else if (!window.ethers) {
        setError("Ethers.js library not loaded. Please refresh the page.");
      } else if (!window.ethers.providers) {
        setError("Ethers.js providers not available. Please refresh the page.");
      }
    }
  }, []);

  // --- Contract Interaction Functions ---

  const mintCarvId = async () => {
    if (!carvIdContract || !signer) {
      setError("Wallet not connected or contract not loaded.");
      return;
    }
    setMessage("Minting CARV ID...");
    setError('');
    try {
      const tokenId = Math.floor(Math.random() * 1000000); // Simple random ID
      const uri = `https://example.com/carv-id/${tokenId}`; // Placeholder URI
      const tx = await carvIdContract.mint(userAddress, tokenId, uri);
      await tx.wait();
      setMessage(`CARV ID ${tokenId} minted successfully! Transaction: ${tx.hash}`);
      setMintingId('');
    } catch (err) {
      console.error("Minting failed:", err);
      setError(`Failed to mint CARV ID: ${err.message}`);
    }
  };

  const grantDataAccessException = async () => {
    if (!carvIdContract || !signer || !grantingId || !grantAgentAddress || !grantDataType) {
      setError("Please fill all grant access fields.");
      return;
    }
    if (!window.ethers || !window.ethers.utils) { // Explicit check for ethers.utils
      setError("Ethers.js utilities not loaded. Please refresh.");
      return;
    }
    setMessage("Granting data access...");
    setError('');
    try {
      const tokenId = parseInt(grantingId);
      const dataTypeHash = window.ethers.utils.keccak256(window.ethers.utils.toUtf8Bytes(grantDataType)); // Use window.ethers directly
      const tx = await carvIdContract.connect(signer).grantAccess(tokenId, grantAgentAddress, dataTypeHash);
      await tx.wait();
      setMessage(`Access granted for CARV ID ${tokenId} to agent ${grantAgentAddress} for data type ${grantDataType}. Tx: ${tx.hash}`);
      setGrantingId('');
      setGrantAgentAddress('');
      setGrantDataType('');
    } catch (err) {
      console.error("Grant access failed:", err);
      setError(`Failed to grant access: ${err.message}`);
    }
  };

  // --- Simulate AI Agent Trigger & On-chain Reporting ---
  // In a real system, this would be triggered by an event or a separate backend.
  // Here, we'll simulate it for demo purposes, and assume the Python script
  // (orchestrator.py) is running separately and will submit results.
  const simulateAIAgentResearch = async () => {
    setMessage("Simulating AI Agent research... (This would trigger an off-chain Python process)");
    setError('');
    if (!window.ethers || !window.ethers.utils) { // Explicit check for ethers.utils
      setError("Ethers.js utilities not loaded. Please refresh.");
      return;
    }
    try {
      const researchTopic = "Drug Discovery - Phase 1";
      const resultHash = window.ethers.utils.keccak256(window.ethers.utils.toUtf8Bytes(`SimulatedResult_${Date.now()}`)); // Use window.ethers directly
      const accuracy = Math.floor(Math.random() * 20) + 80; // Random accuracy between 80-100%
      const agentAddress = userAddress || "0xSimulatedAgentAddress"; // Use user's address for simplicity

      // Store in local state for UI display (simulating on-chain result being mirrored)
      const newResult = {
        id: crypto.randomUUID(),
        researchTopic,
        resultHash,
        accuracy,
        agentAddress,
        timestamp: new Date().toISOString()
      };

      setRetrievedResults(prev => [...prev, newResult]);

      // In a true end-to-end, the Python script would call researchResultsContract.submitAggregatedResult
      // const tx = await researchResultsContract.submitAggregatedResult(researchTopic, resultHash, accuracy, agentAddress);
      // await tx.wait();
      // setMessage(`Simulated AI research completed and result submitted on-chain. Tx: ${tx.hash}`);
      setMessage("Simulated AI research completed. Result added to local state (conceptual on-chain submission).");

    } catch (err) {
      console.error("Simulated AI research submission failed:", err);
      setError(`Simulated AI research submission failed: ${err.message}`);
    }
  };

  // --- Mock SVM Agent Activity ---
  const toggleSvmAgentActivity = () => {
    setIsSvmAgentActive(prev => !prev);
    if (!isSvmAgentActive) {
      setMessage("Simulating AI Agent activity on CARV SVM Chain...");
      setTimeout(() => {
        setMessage("CARV SVM Agent is actively processing data.");
      }, 2000);
    } else {
      setMessage("CARV SVM Agent simulation paused.");
    }
  };

  // --- Gemini API Call for Research Summary ---
  const generateResearchSummary = async (researchTopic, accuracy, resultHash) => {
    setSummaryLoading(true);
    setCurrentSummary('');
    setSummaryModalOpen(true);
    setError('');
    setMessage('Generating summary with Gemini API...');

    const prompt = `Summarize a medical research finding on the topic of '${researchTopic}' that achieved an accuracy of ${accuracy}%. Assume this is a successful initial phase of research. The result hash is ${resultHash}. Focus on potential implications, next steps, and its significance in decentralized medical research. Keep the summary concise, around 100-150 words.`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const apiKey = ""; // If you want to use models other than gemini-2.0-flash or imagen-3.0-generate-002, provide an API key here. Otherwise, leave this as-is.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setCurrentSummary(text);
        setMessage('Research summary generated successfully!');
      } else {
        setCurrentSummary('Failed to generate summary. Unexpected API response.');
        setError('Failed to generate summary. Please try again.');
        console.error("Gemini API response structure unexpected:", result);
      }
    } catch (err) {
      setCurrentSummary('Failed to generate summary due to a network error or API issue.');
      setError(`Failed to generate summary: ${err.message}`);
      console.error("Error calling Gemini API:", err);
    } finally {
      setSummaryLoading(false);
    }
  };

  // --- Gemini API Call for Next Research Steps ---
  const suggestNextSteps = async (researchTopic, accuracy) => {
    setNextStepsLoading(true);
    setCurrentNextSteps('');
    setNextStepsModalOpen(true);
    setError('');
    setMessage('Suggesting next steps with Gemini API...');

    const prompt = `Given a medical research finding on the topic of '${researchTopic}' with an accuracy of ${accuracy}%, suggest 3-5 concrete next steps or areas for further investigation. Consider both scientific methodology and the potential for decentralized collaboration. Format as a bulleted list.`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const apiKey = ""; // If you want to use models other than gemini-2.0-flash or imagen-3.0-generate-002, provide an API key here. Otherwise, leave this as-is.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setCurrentNextSteps(text);
        setMessage('Next steps suggested successfully!');
      } else {
        setCurrentNextSteps('Failed to suggest next steps. Unexpected API response.');
        setError('Failed to suggest next steps. Please try again.');
        console.error("Gemini API response structure unexpected:", result);
      }
    } catch (err) {
      setCurrentNextSteps('Failed to suggest next steps due to a network error or API issue.');
      setError(`Failed to suggest next steps: ${err.message}`);
      console.error("Error calling Gemini API for next steps:", err);
    } finally {
      setNextStepsLoading(false);
    }
  };

  // --- Gemini API Call to Explain Medical Term ---
  const explainMedicalTerm = async () => {
    if (!medicalTerm.trim()) {
      setError("Please enter a medical term to explain.");
      return;
    }
    setExplainTermLoading(true);
    setExplainedTerm('');
    setExplainTermModalOpen(true);
    setError('');
    setMessage('Explaining term with Gemini API...');

    const prompt = `Explain the medical term '${medicalTerm}' in simple, easy-to-understand language, suitable for a general audience. Keep it concise, around 50-70 words.`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const apiKey = ""; // If you want to use models other than gemini-2.0-flash or imagen-3.0-generate-002, provide an API key here. Otherwise, leave this as-is.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setExplainedTerm(text);
        setMessage('Medical term explained successfully!');
      } else {
        setExplainedTerm('Failed to explain term. Unexpected API response.');
        setError('Failed to explain term. Please try again.');
        console.error("Gemini API response structure unexpected:", result);
      }
    } catch (err) {
      setExplainedTerm('Failed to explain term due to a network error or API issue.');
      setError(`Failed to explain term: ${err.message}`);
      console.error("Error calling Gemini API for term explanation:", err);
    } finally {
      setExplainTermLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-inter">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-2xl p-8 space-y-8">
        <h1 className="text-4xl font-bold text-center text-purple-400 mb-8">
          Decentralized AI Medical Research
        </h1>

        {error && (
          <div className="bg-red-700 p-4 rounded-lg text-white text-center font-medium">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-700 p-4 rounded-lg text-white text-center font-medium">
            {message}
          </div>
        )}

        {userAddress ? (
          <div className="text-center text-sm text-gray-400">
            Connected Wallet: <span className="font-mono text-purple-300">{userAddress}</span>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={async () => {
                console.log('Connect wallet clicked, checking dependencies:', {
                  ethereum: !!window.ethereum,
                  ethers: !!window.ethers,
                  ethersProviders: !!(window.ethers && window.ethers.providers)
                });

                if (window.ethereum && window.ethers && window.ethers.providers) {
                  try {
                    // Request account access
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    
                    // Set up provider and contracts after connection
                    const ethProvider = new window.ethers.providers.Web3Provider(window.ethereum);
                    setProvider(ethProvider);
                    
                    const ethSigner = ethProvider.getSigner();
                    const addr = await ethSigner.getAddress();
                    setUserAddress(addr);
                    setSigner(ethSigner);

                    const carvId = new window.ethers.Contract(CARV_ID_NFT_ADDRESS, CARV_ID_NFT_ABI, ethSigner);
                    setCarvIdContract(carvId);

                    const research = new window.ethers.Contract(MEDICAL_RESEARCH_RESULTS_ADDRESS, MEDICAL_RESEARCH_RESULTS_ABI, ethSigner);
                    setResearchResultsContract(research);

                    setMessage("Successfully connected to MetaMask and contracts.");
                    setError(""); // Clear any previous errors
                  } catch (err) {
                    console.error("Failed to connect wallet:", err);
                    if (err.code === 4001) {
                      setError("Connection rejected by user.");
                    } else if (err.code === -32002) {
                      setError("MetaMask is already processing a connection request.");
                    } else {
                      setError(`Failed to connect wallet: ${err.message}`);
                    }
                  }
                } else {
                  if (!window.ethereum) {
                    setError("MetaMask is not installed. Please install MetaMask browser extension.");
                  } else if (!window.ethers) {
                    setError("Ethers.js library not loaded. Please refresh the page.");
                  } else if (!window.ethers.providers) {
                    setError("Ethers.js providers not available. Please refresh the page.");
                  }
                }
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Connect Wallet
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Patient Dashboard */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg space-y-6 border border-purple-500">
            <h2 className="text-2xl font-semibold text-purple-300">Patient Data Ownership</h2>
            <p className="text-gray-300">
              Manage your CARV ID (ERC-721 NFT) and grant/revoke access to anonymized medical data for AI agents.
            </p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter desired CARV ID (e.g., 123)"
                value={mintingId}
                onChange={(e) => setMintingId(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-600 border border-gray-500 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={mintCarvId}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                Mint My CARV ID NFT
              </button>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-600">
              <h3 className="text-xl font-medium text-purple-200">Grant Data Access</h3>
              <input
                type="text"
                placeholder="Your CARV ID Token ID"
                value={grantingId}
                onChange={(e) => setGrantingId(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-600 border border-gray-500 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="AI Agent Wallet Address (e.g., 0x...)"
                value={grantAgentAddress}
                onChange={(e) => setGrantAgentAddress(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-600 border border-gray-500 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Data Type (e.g., 'drug_discovery_data')"
                value={grantDataType}
                onChange={(e) => setGrantDataType(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-600 border border-gray-500 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={grantDataAccessException}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                Grant Access to Agent
              </button>
            </div>
          </div>

          {/* Research Network Dashboard */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg space-y-6 border border-blue-500">
            <h2 className="text-2xl font-semibold text-blue-300">AI Research Network</h2>
            <p className="text-gray-300">
              Trigger AI agents to perform privacy-preserving medical research and view aggregated results.
            </p>

            <button
              onClick={simulateAIAgentResearch}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Start Decentralized Research
            </button>

            <div className="space-y-4 pt-4 border-t border-gray-600">
              <h3 className="text-xl font-medium text-blue-200">Aggregated Research Results</h3>
              {retrievedResults.length > 0 ? (
                <ul className="space-y-3">
                  {retrievedResults.map((result) => (
                    <li key={result.id} className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                      <p className="text-lg font-semibold text-white">{result.researchTopic}</p>
                      <p className="text-sm text-gray-300">Agent: <span className="font-mono">{result.agentAddress}</span></p>
                      <p className="text-sm text-gray-300">Accuracy: <span className="font-bold text-green-400">{result.accuracy}%</span></p>
                      <p className="text-xs text-gray-400 break-all">Result Hash: <span className="font-mono">{result.resultHash}</span></p>
                      <p className="text-xs text-gray-500">Timestamp: {new Date(result.timestamp).toLocaleString()}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button
                          onClick={() => generateResearchSummary(result.researchTopic, result.accuracy, result.resultHash)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 text-sm"
                        >
                          ✨ Summarize Findings
                        </button>
                        <button
                          onClick={() => suggestNextSteps(result.researchTopic, result.accuracy)}
                          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 text-sm"
                        >
                          ✨ Suggest Next Steps
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No research results yet. Start a new research simulation!</p>
              )}
            </div>
          </div>
        </div>

        {/* New section for Mock SVM Agent */}
        <div className="mt-8 p-6 bg-gray-700 rounded-xl shadow-lg space-y-6 border border-teal-500">
          <h2 className="text-2xl font-semibold text-teal-300">CARV SVM Chain Agent (Mock)</h2>
          <p className="text-gray-300">
            This section conceptually represents an AI agent running directly on the CARV SVM Chain,
            leveraging its on-chain execution and shared memory features.
          </p>
          <div className="flex items-center justify-between">
            <span className={`text-lg font-bold ${isSvmAgentActive ? 'text-green-400' : 'text-red-400'}`}>
              Status: {isSvmAgentActive ? 'Active' : 'Inactive'}
            </span>
            <button
              onClick={toggleSvmAgentActivity}
              className={`py-2 px-5 rounded-lg font-bold shadow-md transition duration-300 ease-in-out transform hover:scale-105 ${
                isSvmAgentActive ? 'bg-red-600 hover:bg-red-700' : 'bg-teal-600 hover:bg-teal-700'
              } text-white`}
            >
              {isSvmAgentActive ? 'Deactivate SVM Agent' : 'Activate SVM Agent'}
            </button>
          </div>
          {isSvmAgentActive && (
            <div className="bg-gray-600 p-4 rounded-lg text-center text-gray-200">
              <p className="animate-pulse">
                <span className="inline-block mr-2">⚙️</span>
                CARV SVM Agent is processing data and coordinating tasks on-chain...
              </p>
            </div>
          )}
        </div>

        {/* New section for Explain Medical Term */}
        <div className="mt-8 p-6 bg-gray-700 rounded-xl shadow-lg space-y-6 border border-orange-500">
          <h2 className="text-2xl font-semibold text-orange-300">Medical Term Explainer ✨</h2>
          <p className="text-gray-300">
            Get a simplified explanation of any medical term using AI.
          </p>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter medical term (e.g., 'Hypertension')"
              value={medicalTerm}
              onChange={(e) => setMedicalTerm(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-600 border border-gray-500 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={explainMedicalTerm}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Explain Term
            </button>
          </div>
        </div>


        <div className="mt-8 p-6 bg-gray-700 rounded-lg shadow-lg border border-yellow-500">
          <h2 className="text-2xl font-semibold text-yellow-300 mb-4">Backend & Smart Contract Details</h2>
          <p className="text-gray-300 mb-4">
            This application interacts with smart contracts deployed on the Sepolia testnet and conceptually
            with the CARV D.A.T.A. Framework. The AI computation and orchestration are handled by off-chain
            Python scripts.
          </p>
          <div className="space-y-3 text-gray-300 text-sm">
            <p>
              <span className="font-semibold text-yellow-200">CARV ID Contract:</span>{" "}
              <span className="font-mono break-all">{CARV_ID_NFT_ADDRESS}</span>
            </p>
            <p>
              <span className="font-semibold text-yellow-200">Medical Research Results Contract:</span>{" "}
              <span className="font-mono break-all">{MEDICAL_RESEARCH_RESULTS_ADDRESS}</span>
            </p>
            <p className="text-gray-400">
              **Note:** Replace the placeholder contract addresses in the React code with your actual deployed addresses.
            </p>
            <p className="text-gray-400">
              **D.A.T.A. Framework API:** You need to obtain an API key from CARV (developer@carv.io) to
              integrate with their D.A.T.A. Framework for real-time, verifiable data access.
              Without it, data bridging will rely on IPFS or local files.
            </p>
            <p className="text-gray-400">
              **AI Agent Execution:** The Python AI agent and orchestrator scripts (`ai_agent.py`, `orchestrator.py`, `data_provider.py`)
              run off-chain. The `Start Decentralized Research` button in the UI simulates triggering this off-chain process,
              which then reports results back to the `MedicalResearchResults` contract.
            </p>
            <p className="text-gray-400">
              **CARV SVM Chain:** In a full production system, the AI agents and their complex computations
              would ideally be deployed directly on the CARV SVM Chain for optimized, verifiable execution.
              This proof-of-concept demonstrates the interaction flow that would leverage such a chain.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Modal */}
      {summaryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-2xl space-y-6 border border-indigo-500">
            <h2 className="text-3xl font-bold text-indigo-400 text-center">Research Summary ✨</h2>
            {summaryLoading ? (
              <div className="text-center text-lg text-gray-300 flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating...</span>
              </div>
            ) : (
              <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{currentSummary || "No summary available."}</p>
            )}
            <button
              onClick={() => setSummaryModalOpen(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Next Steps Modal */}
      {nextStepsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-2xl space-y-6 border border-teal-500">
            <h2 className="text-3xl font-bold text-teal-400 text-center">Next Research Steps ✨</h2>
            {nextStepsLoading ? (
              <div className="text-center text-lg text-gray-300 flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating...</span>
              </div>
            ) : (
              <div className="text-gray-200 leading-relaxed">
                {/* Render markdown content from LLM */}
                <div dangerouslySetInnerHTML={{ __html: window.marked.parse(currentNextSteps || "No next steps suggested.") }} />
              </div>
            )}
            <button
              onClick={() => setNextStepsModalOpen(false)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Explain Term Modal */}
      {explainTermModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-2xl space-y-6 border border-orange-500">
            <h2 className="text-3xl font-bold text-orange-400 text-center">Medical Term Explanation ✨</h2>
            {explainTermLoading ? (
              <div className="text-center text-lg text-gray-300 flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating...</span>
              </div>
            ) : (
              <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{explainedTerm || "No explanation available."}</p>
            )}
            <button
              onClick={() => setExplainTermModalOpen(false)}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
