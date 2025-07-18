import React, { useState, useEffect } from 'react';
import { marked } from 'marked';

function AIAgentPage({
  simulateAIAgentResearch,
  retrievedResults,
  generateResearchSummary,
  suggestNextSteps,
  medicalTerm,
  setMedicalTerm,
  explainMedicalTerm,
}) {
  const [currentModal, setCurrentModal] = useState(null);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStartingResearch, setIsStartingResearch] = useState(false);
  const [notification, setNotification] = useState(null);

  // Sample data to match the HTML template
  const [results, setResults] = useState([
    {
      id: 1,
      topic: "Disease X Prediction Model",
      accuracy: 92,
      hash: "0x1a2b3c4d...",
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      topic: "Genomic Marker Identification",
      accuracy: 88,
      hash: "0x3c4d5e6f...",
      timestamp: new Date().toISOString(),
    },
    {
      id: 3,
      topic: "Drug Efficacy Analysis",
      accuracy: 95,
      hash: "0x7g8h9i0j...",
      timestamp: new Date().toISOString(),
    }
  ]);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleStartResearch = () => {
    setIsStartingResearch(true);
    showNotification('Initiating AI research simulation...', 'info');
    
    // Simulate research process with 8 second delay
    setTimeout(() => {
      const newResult = {
        id: Date.now(),
        topic: `Advanced Research Study #${Math.floor(Math.random() * 100)}`,
        accuracy: Math.floor(Math.random() * 10) + 89,
        hash: `0x${[...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}...`,
        timestamp: new Date().toISOString(),
      };
      setResults(prev => [newResult, ...prev]);
      setIsStartingResearch(false);
      showNotification('New research result submitted on-chain!', 'success');
    }, 8000);
  };

  const showAISummary = (resultId) => {
    const result = results.find(r => r.id === resultId);
    setModalTitle(`Summary for "${result.topic}"`);
    setIsLoading(true);
    setCurrentModal('summary');
    
    // Simulate AI generation
    setTimeout(() => {
      const summaryText = `The AI-driven analysis for **"${result.topic}"** achieved a promising accuracy of **${result.accuracy}%**. This indicates a strong predictive correlation within the anonymized dataset. Key findings suggest that specific biomarkers (encoded in the data) are highly indicative of treatment outcomes. This represents a significant step forward in our DeSci initiative, demonstrating that collaborative, privacy-preserving research can yield high-fidelity results.`;
      setModalContent(summaryText);
      setIsLoading(false);
    }, 2000);
  };

  const showAINextSteps = (resultId) => {
    const result = results.find(r => r.id === resultId);
    setModalTitle(`Next Steps for "${result.topic}"`);
    setIsLoading(true);
    setCurrentModal('nextSteps');
    
    // Simulate AI generation
    setTimeout(() => {
      const nextStepsText = `Based on the ${result.accuracy}% accuracy, the following next steps are recommended:

• **Model Refinement:** Introduce more complex neural network architectures to potentially increase accuracy above 95%.
• **Cross-Validation:** Onboard two more data providers through the D.A.T.A. framework to validate the model against new, unseen datasets.
• **Feature Importance Analysis:** Run interpretability models (e.g., SHAP) to identify the most influential biomarkers.
• **Publish On-Chain Proof:** Submit the result hash and a summary to a permanent storage solution like Arweave, linked from the results contract.`;
      setModalContent(nextStepsText);
      setIsLoading(false);
    }, 2000);
  };

  const closeModal = () => {
    setCurrentModal(null);
    setModalContent('');
    setModalTitle('');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className={`p-4 rounded-lg shadow-lg border ${
            notification.type === 'success' 
              ? 'bg-green-100 border-green-400 text-green-700' 
              : 'bg-blue-100 border-blue-400 text-blue-700'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {notification.type === 'success' ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Research & Collaboration</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trigger decentralized research tasks, view on-chain results, and leverage AI for deeper insights
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 space-y-8">
          {/* Start Research Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Start AI Research</h2>
            <p className="text-gray-600 mb-6">
              Initiate a new collaborative research study. This simulates triggering AI agents on the CARV SVM Chain to perform Federated Learning.
            </p>
            <button
              onClick={handleStartResearch}
              disabled={isStartingResearch}
              className={`w-full font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ${
                isStartingResearch 
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isStartingResearch ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Research...
                </div>
              ) : (
                'Start Decentralized Research Simulation'
              )}
            </button>
          </div>

          {/* Research Results Section */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Aggregated Research Results</h2>
            <p className="text-gray-600 mb-6">
              Results are submitted by AI agents and recorded immutably on the blockchain.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => (
                <div key={result.id} className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-bold text-indigo-700 mb-2">{result.topic}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Accuracy: <span className="font-bold text-green-600">{result.accuracy}%</span>
                  </p>
                  <p className="text-xs text-gray-400 font-mono break-all mb-4">
                    Hash: {result.hash}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => showAISummary(result.id)}
                      className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-3 rounded-lg text-xs transition"
                    >
                      ✨ Summarize
                    </button>
                    <button
                      onClick={() => showAINextSteps(result.id)}
                      className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-3 rounded-lg text-xs transition"
                    >
                      ✨ Next Steps
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Medical Term Explainer */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Medical Term Explainer</h2>
            <p className="text-gray-600 mb-6">
              Get simplified explanations of complex medical terms using AI.
            </p>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter medical term (e.g., 'Hypertension')"
                value={medicalTerm}
                onChange={(e) => setMedicalTerm(e.target.value)}
                className="flex-1 p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={explainMedicalTerm}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-md transition duration-300"
              >
                Explain
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Modal */}
      {currentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl space-y-6 border-4 border-indigo-300">
            <h2 className="text-3xl font-bold text-indigo-600 text-center">{modalTitle}</h2>
            {isLoading ? (
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-gray-600">Generating...</p>
              </div>
            ) : (
              <div className="text-gray-700 leading-relaxed max-h-80 overflow-y-auto">
                <div dangerouslySetInnerHTML={{ __html: marked.parse(modalContent) }} />
              </div>
            )}
            <button
              onClick={closeModal}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIAgentPage;