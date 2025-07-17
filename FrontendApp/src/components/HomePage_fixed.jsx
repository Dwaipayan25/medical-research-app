import React from 'react';

function HomePage({ onLaunchApp }) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-inter">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="max-w-7xl mx-auto space-y-12 lg:space-y-16 text-center">
          {/* Hero Section */}
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 lg:p-12 space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-purple-400 leading-tight">
              Decentralized AI Medical Research Network
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto">
              Empowering collaborative and privacy-preserving medical research through decentralized AI agents and data ownership.
            </p>
            <button
              onClick={onLaunchApp}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 sm:px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-base sm:text-lg"
            >
              Launch App
            </button>
          </div>

          {/* About Section */}
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 lg:p-12 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-purple-300">About This Project</h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-5xl mx-auto leading-relaxed">
              Medical research is often hindered by data silos and critical privacy concerns, preventing the collaborative analysis of large, diverse datasets. This project addresses these challenges by enabling secure, privacy-preserving, and decentralized medical research. It leverages AI agents to collaboratively analyze anonymized medical data, ensuring patients retain full data ownership and granular control over access permissions, fostering both public good and individual privacy.
            </p>
          </div>

          {/* Technologies Used Section */}
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 lg:p-12 space-y-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-purple-300">Key Technologies & Their Role</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {/* CARV SVM Chain */}
              <div className="bg-gray-700 p-4 sm:p-6 rounded-xl shadow-lg space-y-4 border border-purple-600 hover:border-purple-400 transition-colors duration-300">
                <h3 className="text-lg sm:text-xl font-bold text-purple-200">CARV SVM Chain</h3>
                <img src="https://placehold.co/300x200/2a9d8f/ffffff?text=CARV+SVM+Chain" alt="CARV SVM Chain Logo" className="w-full h-24 sm:h-32 object-contain rounded-lg" />
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                  **General:** High-throughput, Solana-VM execution settled onto Ethereum for finality; designed as an AI agentic infrastructure.
                </p>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  **Use Case:** The conceptual environment for deploying and orchestrating AI agents, leveraging its on-chain execution and shared memory for verifiable and collaborative medical research.
                </p>
              </div>

              {/* CARV D.A.T.A. Framework */}
              <div className="bg-gray-700 p-4 sm:p-6 rounded-xl shadow-lg space-y-4 border border-purple-600 hover:border-purple-400 transition-colors duration-300">
                <h3 className="text-lg sm:text-xl font-bold text-purple-200">CARV D.A.T.A. Framework</h3>
                <img src="https://placehold.co/300x200/e9c46a/000000?text=CARV+D.A.T.A." alt="CARV D.A.T.A. Framework Logo" className="w-full h-24 sm:h-32 object-contain rounded-lg" />
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                  **General:** Data Authentication, Trust, and Attestation framework for securely bridging on-chain and off-chain data.
                </p>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  **Use Case:** Securely orchestrating and making anonymized multi-chain/off-chain medical data available to AI agents, ensuring privacy and verifiability.
                </p>
              </div>

              {/* CARV ID (ERC-7231) */}
              <div className="bg-gray-700 p-4 sm:p-6 rounded-xl shadow-lg space-y-4 border border-purple-600 hover:border-purple-400 transition-colors duration-300">
                <h3 className="text-lg sm:text-xl font-bold text-purple-200">CARV ID (ERC-7231)</h3>
                <img src="https://placehold.co/300x200/f4a261/000000?text=CARV+ID" alt="CARV ID Logo" className="w-full h-24 sm:h-32 object-contain rounded-lg" />
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                  **General:** A persistent, composable identity standard (ERC-7231) that aggregates cross-chain and off-chain identities.
                </p>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  **Use Case:** Managing patient identity and granting granular, verifiable data access permissions to AI agents for research, ensuring patient data ownership and privacy.
                </p>
              </div>

              {/* Gemini API (Google LLMs) */}
              <div className="bg-gray-700 p-4 sm:p-6 rounded-xl shadow-lg space-y-4 border border-purple-600 hover:border-purple-400 transition-colors duration-300">
                <h3 className="text-lg sm:text-xl font-bold text-purple-200">Gemini API (Google LLMs)</h3>
                <img src="https://placehold.co/300x200/e76f51/ffffff?text=Gemini+API" alt="Gemini API Logo" className="w-full h-24 sm:h-32 object-contain rounded-lg" />
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                  **General:** Provides access to powerful Large Language Models for understanding, generating, and processing natural language.
                </p>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  **Use Case:** Enhancing user experience by providing AI-powered summaries of research findings, suggesting next research steps, and explaining complex medical terms.
                </p>
              </div>

              {/* Python */}
              <div className="bg-gray-700 p-4 sm:p-6 rounded-xl shadow-lg space-y-4 border border-purple-600 hover:border-purple-400 transition-colors duration-300">
                <h3 className="text-lg sm:text-xl font-bold text-purple-200">Python</h3>
                <img src="https://placehold.co/300x200/3a86ff/ffffff?text=Python" alt="Python Logo" className="w-full h-24 sm:h-32 object-contain rounded-lg" />
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                  **General:** A versatile, high-level programming language widely used for AI/ML, data science, and backend development.
                </p>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  **Use Case:** Implementing the core AI agent logic (e.g., federated learning simulation), data provisioning, and orchestrating interactions with smart contracts and external APIs.
                </p>
              </div>

              {/* React (with Vite) */}
              <div className="bg-gray-700 p-4 sm:p-6 rounded-xl shadow-lg space-y-4 border border-purple-600 hover:border-purple-400 transition-colors duration-300">
                <h3 className="text-lg sm:text-xl font-bold text-purple-200">React (with Vite)</h3>
                <img src="https://placehold.co/300x200/ffbe0b/000000?text=React+%26+Vite" alt="React & Vite Logo" className="w-full h-24 sm:h-32 object-contain rounded-lg" />
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                  **General:** A JavaScript library for building user interfaces, often used with bundlers like Vite for fast development and optimized builds.
                </p>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  **Use Case:** Building the interactive and responsive frontend Decentralized Application (DApp) for patients to manage their data access, trigger research simulations, and view AI-powered insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
