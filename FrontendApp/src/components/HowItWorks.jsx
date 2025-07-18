import React from 'react';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover how our decentralized medical research platform ensures privacy, security, and collaborative innovation
          </p>
        </div>

        {/* Architecture Flow */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">System Architecture</h2>
          
          {/* New Simple End-to-End Flow Graph */}
          <div className="mt-12 p-8 bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col items-center space-y-6">
            <h2 className="text-2xl font-bold text-indigo-700 text-center mb-4">The MediChain AI Journey</h2>
            
            <div className="flow-box border-indigo-500 bg-indigo-50 text-indigo-800">
              <span className="text-3xl">👤</span><br />
              <span className="font-bold">1. Patient Owns Data</span><br />
              <span className="text-sm">Via CARV ID (ERC-7231)</span>
            </div>
            <div className="flow-arrow border-indigo-300"></div>

            <div className="flow-box border-teal-500 bg-teal-50 text-teal-800">
              <span className="text-3xl">🔒</span><br />
              <span className="font-bold">2. Grants Privacy-Preserving Access</span><br />
              <span className="text-sm">Through CARV ID & D.A.T.A. Framework</span>
            </div>
            <div className="flow-arrow border-teal-300"></div>

            <div className="flow-box border-amber-500 bg-amber-50 text-amber-800">
              <span className="text-3xl">🤖</span><br />
              <span className="font-bold">3. AI Agents Research</span><br />
              <span className="text-sm">Collaborative Federated Learning on CARV SVM Chain</span>
            </div>
            <div className="flow-arrow border-amber-300"></div>

            <div className="flow-box border-purple-500 bg-purple-50 text-purple-800">
              <span className="text-3xl">💡</span><br />
              <span className="font-bold">4. Insights On-Chain</span><br />
              <span className="text-sm">Verifiable Results & Gemini-Powered Explanations</span>
            </div>
            <p className="text-center mt-6 text-slate-600 text-sm">This simplified flow highlights our core value proposition and integration with CARV's key technologies, directly addressing <strong>Tracks 2.1, 2.2, 2.3, and 2.4</strong>.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mt-12">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Detailed System Architecture</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flow-box bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <div className="text-center">
                  <div className="text-4xl mb-4">🏥</div>
                  <h3 className="text-xl font-semibold mb-2">Data Sources</h3>
                  <p className="text-sm">Hospitals, clinics, and research institutions</p>
                </div>
              </div>
              
              <div className="flow-arrow">→</div>
              
              <div className="flow-box bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                <div className="text-center">
                  <div className="text-4xl mb-4">🔐</div>
                  <h3 className="text-xl font-semibold mb-2">CARV ID Privacy</h3>
                  <p className="text-sm">Encrypted data with granular access control</p>
                </div>
              </div>
              
              <div className="flow-arrow">→</div>
              
              <div className="flow-box bg-gradient-to-r from-green-500 to-teal-600 text-white">
                <div className="text-center">
                  <div className="text-4xl mb-4">🤖</div>
                  <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                  <p className="text-sm">Federated learning and collaborative research</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Research Process</h2>
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-indigo-500">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold mr-4">1</div>
                <h3 className="text-xl font-semibold text-gray-900">Data Registration</h3>
              </div>
              <p className="text-gray-600 ml-14">
                Medical institutions register their anonymized datasets using CARV ID NFTs, maintaining full ownership and control over access permissions.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold mr-4">2</div>
                <h3 className="text-xl font-semibold text-gray-900">Access Granting</h3>
              </div>
              <p className="text-gray-600 ml-14">
                Data owners grant specific AI research agents access to particular data types, ensuring granular control over what information is shared.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold mr-4">3</div>
                <h3 className="text-xl font-semibold text-gray-900">Federated Learning</h3>
              </div>
              <p className="text-gray-600 ml-14">
                AI agents perform collaborative analysis without accessing raw data, using federated learning techniques to preserve privacy while enabling research.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold mr-4">4</div>
                <h3 className="text-xl font-semibold text-gray-900">Results Publication</h3>
              </div>
              <p className="text-gray-600 ml-14">
                Aggregated research findings are published on-chain with accuracy metrics and verifiable proofs, ensuring transparency and reproducibility.
              </p>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Privacy First</h3>
              <p className="text-gray-600">Complete data ownership with granular access controls</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Collaborative</h3>
              <p className="text-gray-600">Multiple institutions can contribute to research safely</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verifiable</h3>
              <p className="text-gray-600">On-chain proofs ensure research integrity</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Scalable</h3>
              <p className="text-gray-600">Built on high-performance blockchain infrastructure</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered</h3>
              <p className="text-gray-600">Advanced machine learning for medical insights</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Decentralized</h3>
              <p className="text-gray-600">No single point of failure or control</p>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-xl">🔗</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">CARV SVM Chain</h3>
              </div>
              <p className="text-gray-600 text-sm">
                High-throughput blockchain for AI agent orchestration and execution
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-xl">🆔</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">CARV ID</h3>
              </div>
              <p className="text-gray-600 text-sm">
                ERC-7231 identity standard for secure data access management
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-xl">🔐</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">D.A.T.A. Framework</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Data Authentication, Trust, and Attestation for secure bridging
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-xl">🤖</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Gemini AI</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Advanced language models for research insights and explanations
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-xl">⚛️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">React</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Modern frontend framework for interactive user experiences
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-xl">🐍</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Python</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Backend processing for AI/ML algorithms and data orchestration
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
