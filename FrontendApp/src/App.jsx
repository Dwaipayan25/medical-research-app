import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import HomePage from './components/HomePage'
import HowItWorks from './components/HowItWorks'
import Navbar from './components/Navbar'
import CarvIdPage from './components/CarvIdPage'
import AIAgentPage from './components/AIAgentPage'
import './App.css'

import React from 'react';
import { ethers } from 'ethers';
import { marked } from 'marked';

/*
 * ENVIRONMENT VARIABLES SETUP:
 * Create a .env file in the root of your project with the following variables:
 * 
 * VITE_GEMINI_API_KEY=your_gemini_api_key_here
 * VITE_CARV_ID_NFT_ADDRESS=0xYourCarvIdContractAddress
 * VITE_MEDICAL_RESEARCH_RESULTS_ADDRESS=0xYourMedicalResearchContractAddress
 * 
 * Get your Gemini API key from: https://aistudio.google.com/app/apikey
 * Replace contract addresses with your deployed contract addresses
 */

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
const CARV_ID_NFT_ADDRESS = import.meta.env.VITE_CARV_ID_NFT_ADDRESS || "0xE2E6A824816A5f184ba3124c736A43c6734bB122"; // Fallback address

const MEDICAL_RESEARCH_RESULTS_ABI = [
  "function submitAggregatedResult(string researchTopic, bytes32 resultHash, uint256 accuracy, address agentAddress) public",
  "function getResearchResult(string researchTopic, address agentAddress) view returns (bytes32 resultHash, uint256 accuracy)",
  "event ResearchResultSubmitted(string indexed researchTopic, bytes32 indexed resultHash, uint256 accuracy, address indexed agentAddress)"
];
const MEDICAL_RESEARCH_RESULTS_ADDRESS = import.meta.env.VITE_MEDICAL_RESEARCH_RESULTS_ADDRESS || "0x9769f12E69A2eeaEd5b5FFc3ba23e5F6B6FA3360"; // Fallback address

// --- AI Agent (Off-chain Python) - Conceptual Interaction ---
// In a real scenario, this would be a Python backend service. For this demo,
// we'll simulate its "triggering" and assume it reports back.
// You would run your Python orchestrator.py script separately.

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'howItWorks', 'carvId', 'aiAgent'

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
  const [retrievedResults, setRetrievedResults] = useState([]); // This will now be managed locally or by a new data source
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

  // Log contracts when they are properly set
  useEffect(() => {
    if (carvIdContract && researchResultsContract) {
      console.log("Contracts initialized:", {
        carvIdContract,
        researchResultsContract
      });
    }
  }, [carvIdContract, researchResultsContract]);

  // --- Web3 Initialization ---
  useEffect(() => {
    // Check if user was previously connected
    checkIfWalletIsConnected();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // --- Monitor contract state changes ---
  useEffect(() => {
    if (carvIdContract && researchResultsContract) {
      console.log("Contracts successfully initialized:");
      console.log("CARV ID Contract:", carvIdContract);
      console.log("Research Results Contract:", researchResultsContract);
      console.log("User Address:", userAddress);
    }
  }, [carvIdContract, researchResultsContract, userAddress]);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        console.log("MetaMask not detected");
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("Wallet is connected:", account);
        setUserAddress(account);
        await setupWeb3(account);
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError("MetaMask is not installed. Please install MetaMask browser extension.");
        return;
      }

      setMessage("Connecting to MetaMask...");
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts.length > 0) {
        const account = accounts[0];
        setUserAddress(account);
        await setupWeb3(account);
        setMessage("Successfully connected to MetaMask!");
        setError("");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      if (error.code === 4001) {
        setError("Connection rejected by user.");
      } else if (error.code === -32002) {
        setError("MetaMask is already processing a connection request.");
      } else {
        setError(`Failed to connect wallet: ${error.message}`);
      }
      setMessage("");
    }
  };

  const disconnectWallet = () => {
    setUserAddress(null);
    setSigner(null);
    setProvider(null);
    setCarvIdContract(null);
    setResearchResultsContract(null);
    setMessage("Wallet disconnected");
    setError("");
  };

  const setupWeb3 = async (account) => {
    try {
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(ethProvider);
      
      const ethSigner = ethProvider.getSigner();
      setSigner(ethSigner);

      const carvId = new ethers.Contract(CARV_ID_NFT_ADDRESS, CARV_ID_NFT_ABI, ethSigner);
      setCarvIdContract(carvId);

      const research = new ethers.Contract(MEDICAL_RESEARCH_RESULTS_ADDRESS, MEDICAL_RESEARCH_RESULTS_ABI, ethSigner);
      setResearchResultsContract(research);

      console.log("Web3 setup complete");
    } catch (error) {
      console.error("Error setting up Web3:", error);
      setError("Failed to set up Web3 connection");
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setUserAddress(accounts[0]);
      setupWeb3(accounts[0]);
    } else {
      disconnectWallet();
    }
  };

  const handleChainChanged = () => {
    // Reload the page when network changes
    window.location.reload();
  };

  // --- Research Results Management (Now local to frontend for demo without Firebase) ---
  // If you want persistence, you'll need to integrate a new database or on-chain storage.
  // For now, results will be added to state and lost on refresh.
  // The 'onSnapshot' equivalent is removed.

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
    setMessage("Granting data access...");
    setError('');
    try {
      const tokenId = parseInt(grantingId);
      const dataTypeHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(grantDataType));
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
  // Here, we'll simulate its "triggering" and assume the Python script
  // (orchestrator.py) is running separately and will submit results.
  const simulateAIAgentResearch = async () => {
    setMessage("Simulating AI Agent research... (This would trigger an off-chain Python process)");
    setError('');
    try {
      // Simulate a new research result being generated by the off-chain Python script
      // In a full end-to-end, the Python script would call researchResultsContract.submitAggregatedResult
      // and then you'd listen for that event or poll the contract.
      // For this demo, we'll just add a mock result to the local state.
      const researchTopic = "Drug Discovery - Phase 1";
      const resultHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(`SimulatedResult_${Date.now()}`));
      const accuracy = Math.floor(Math.random() * 20) + 80; // Random accuracy between 80-100%
      const agentAddress = userAddress || "0xSimulatedAgentAddress";

      const newResult = {
        id: Date.now().toString(), // Unique ID for React key
        researchTopic,
        resultHash,
        accuracy,
        agentAddress,
        timestamp: new Date().toISOString(),
      };

      setRetrievedResults(prevResults => [...prevResults, newResult]);
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
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; // Get API key from environment variables
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
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; // Get API key from environment variables
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
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; // Get API key from environment variables
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

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'howItWorks':
        return <HowItWorks />;
      case 'carvId':
        return (
          <CarvIdPage
            userAddress={userAddress}
            mintingId={mintingId}
            setMintingId={setMintingId}
            mintCarvId={mintCarvId}
            grantingId={grantingId}
            setGrantingId={setGrantingId}
            grantAgentAddress={grantAgentAddress}
            setGrantAgentAddress={setGrantAgentAddress}
            grantDataType={grantDataType}
            setGrantDataType={setGrantDataType}
            grantDataAccessException={grantDataAccessException}
          />
        );
      case 'aiAgent':
        return (
          <AIAgentPage
            simulateAIAgentResearch={simulateAIAgentResearch}
            retrievedResults={retrievedResults}
            generateResearchSummary={generateResearchSummary}
            suggestNextSteps={suggestNextSteps}
            isSvmAgentActive={isSvmAgentActive}
            toggleSvmAgentActivity={toggleSvmAgentActivity}
            medicalTerm={medicalTerm}
            setMedicalTerm={setMedicalTerm}
            explainMedicalTerm={explainMedicalTerm}
            summaryModalOpen={summaryModalOpen}
            setSummaryModalOpen={setSummaryModalOpen}
            currentSummary={currentSummary}
            summaryLoading={summaryLoading}
            nextStepsModalOpen={nextStepsModalOpen}
            setNextStepsModalOpen={setNextStepsModalOpen}
            currentNextSteps={currentNextSteps}
            nextStepsLoading={nextStepsLoading}
            explainTermModalOpen={explainTermModalOpen}
            setExplainTermModalOpen={setExplainTermModalOpen}
            explainedTerm={explainedTerm}
            explainTermLoading={explainTermLoading}
          />
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <Navbar 
        userAddress={userAddress}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Main Content */}
      <div className="pt-20">

      {/* Global Messages */}
      <div className="max-w-4xl mx-auto p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center font-medium mb-4">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center font-medium mb-4">
            {message}
          </div>
        )}
      </div>

      {/* Render Current Page */}
      {renderPage()}

      {/* Global Modals (Summary, Next Steps, Explain Term) */}
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
                <div dangerouslySetInnerHTML={{ __html: marked.parse(currentNextSteps || "No next steps suggested.") }} />
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
    </div>
  );
}

export default App;
