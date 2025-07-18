import React from 'react';
import { marked } from 'marked';

function AIAgentPage({
  simulateAIAgentResearch,
  retrievedResults,
  generateResearchSummary,
  suggestNextSteps,
  isSvmAgentActive,
  toggleSvmAgentActivity,
  medicalTerm,
  setMedicalTerm,
  explainMedicalTerm,
  summaryModalOpen,
  setSummaryModalOpen,
  currentSummary,
  summaryLoading,
  nextStepsModalOpen,
  setNextStepsModalOpen,
  currentNextSteps,
  nextStepsLoading,
  explainTermModalOpen,
  setExplainTermModalOpen,
  explainedTerm,
  explainTermLoading,
}) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-inter">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-purple-400 mb-8">
            AI Agent & Research
          </h1>

          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 lg:p-12 space-y-8">
            {/* Research Network Dashboard */}
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg space-y-6 border border-blue-500">
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-300">AI Research Network</h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Trigger AI agents to perform privacy-preserving medical research and view aggregated results.
              </p>

              <button
                onClick={simulateAIAgentResearch}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 sm:py-4 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-sm sm:text-base"
              >
                Start Decentralized Research
              </button>

              <div className="space-y-4 pt-4 border-t border-gray-600">
                <h3 className="text-lg sm:text-xl font-medium text-blue-200">Aggregated Research Results</h3>
                {retrievedResults.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                    {retrievedResults.map((result) => (
                      <div key={result.id} className="bg-gray-600 p-4 sm:p-6 rounded-lg border border-gray-500 space-y-3">
                        <p className="text-base sm:text-lg font-semibold text-white">{result.researchTopic}</p>
                        <p className="text-xs sm:text-sm text-gray-300 break-all">Agent: <span className="font-mono">{result.agentAddress}</span></p>
                        <p className="text-xs sm:text-sm text-gray-300">Accuracy: <span className="font-bold text-green-400">{result.accuracy}%</span></p>
                        <p className="text-xs text-gray-400 break-all">Result Hash: <span className="font-mono text-xs">{result.resultHash}</span></p>
                        <p className="text-xs text-gray-500">Timestamp: {new Date(result.timestamp).toLocaleString()}</p>
                        <div className="flex flex-col sm:flex-row gap-2 mt-3">
                          <button
                            onClick={() => generateResearchSummary(result.researchTopic, result.accuracy, result.resultHash)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 sm:px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 text-xs sm:text-sm"
                          >
                            ✨ Summarize Findings
                          </button>
                          <button
                            onClick={() => suggestNextSteps(result.researchTopic, result.accuracy)}
                            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-3 sm:px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 text-xs sm:text-sm"
                          >
                            ✨ Suggest Next Steps
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm sm:text-base">No research results yet. Start a new research simulation!</p>
                )}
              </div>
            </div>

            {/* CARV SVM Chain Agent (Mock) */}
            <div className="bg-gray-700 p-6 rounded-xl shadow-lg space-y-6 border border-teal-500">
              <h2 className="text-xl sm:text-2xl font-semibold text-teal-300">CARV SVM Chain Agent (Mock)</h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                This section conceptually represents an AI agent running directly on the CARV SVM Chain,
                leveraging its on-chain execution and shared memory features.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className={`text-base sm:text-lg font-bold ${isSvmAgentActive ? 'text-green-400' : 'text-red-400'}`}>
                  Status: {isSvmAgentActive ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={toggleSvmAgentActivity}
                  className={`py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-bold shadow-md transition duration-300 ease-in-out transform hover:scale-105 text-sm sm:text-base ${
                    isSvmAgentActive ? 'bg-red-600 hover:bg-red-700' : 'bg-teal-600 hover:bg-teal-700'
                  } text-white`}
                >
                  {isSvmAgentActive ? 'Deactivate SVM Agent' : 'Activate SVM Agent'}
                </button>
              </div>
              {isSvmAgentActive && (
                <div className="bg-gray-600 p-4 rounded-lg text-center text-gray-200">
                  <p className="animate-pulse text-sm sm:text-base">
                    <span className="inline-block mr-2">⚙️</span>
                    CARV SVM Agent is processing data and coordinating tasks on-chain...
                  </p>
                </div>
              )}
            </div>

            {/* Medical Term Explainer */}
            <div className="bg-gray-700 p-6 rounded-xl shadow-lg space-y-6 border border-orange-500">
              <h2 className="text-xl sm:text-2xl font-semibold text-orange-300">Medical Term Explainer ✨</h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Get a simplified explanation of any medical term using AI.
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter medical term (e.g., 'Hypertension')"
                  value={medicalTerm}
                  onChange={(e) => setMedicalTerm(e.target.value)}
                  className="w-full p-3 sm:p-4 rounded-lg bg-gray-600 border border-gray-500 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                />
                <button
                  onClick={explainMedicalTerm}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 sm:py-4 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 text-sm sm:text-base"
                >
                  Explain Term
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Modal */}
      {summaryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-2xl lg:max-w-4xl space-y-6 border border-indigo-500 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-indigo-400 text-center">Research Summary ✨</h2>
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
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 z-50" style={{ width: '100vw', height: '100vh' }}>
          <div className="bg-gray-800 border border-teal-500 w-full h-full flex flex-col" style={{ width: '100vw', height: '100vh' }}>
            {/* Header - Fixed at top */}
            <div className="p-4 sm:p-6 border-b border-gray-700 flex-shrink-0 bg-gray-800">
              <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 text-center">Next Research Steps ✨</h2>
            </div>
            
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
              <div className="p-4 sm:p-6 lg:p-8">
                {nextStepsLoading ? (
                  <div className="text-center text-lg text-gray-300 flex items-center justify-center space-x-2 min-h-[200px]">
                    <svg className="animate-spin h-5 w-5 text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating...</span>
                  </div>
                ) : (
                  <div className="text-gray-200 leading-relaxed max-w-4xl mx-auto">
                    {/* Render markdown content from LLM */}
                    <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(currentNextSteps || "No next steps suggested.") }} />
                  </div>
                )}
              </div>
            </div>
            
            {/* Footer - Fixed at bottom */}
            <div className="p-4 sm:p-6 border-t border-gray-700 flex-shrink-0 bg-gray-800">
              <button
                onClick={() => setNextStepsModalOpen(false)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                Close
              </button>
            </div>
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

export default AIAgentPage;