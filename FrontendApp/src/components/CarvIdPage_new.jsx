import React from 'react';

function CarvIdPage({
  userAddress,
  userId,
  mintingId,
  setMintingId,
  mintCarvId,
  grantingId,
  setGrantingId,
  grantAgentAddress,
  setGrantAgentAddress,
  grantDataType,
  setGrantDataType,
  grantDataAccessException,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CARV ID & Data Sovereignty
          </h1>
          <p className="text-lg text-gray-600">
            Manage your decentralized identity and grant privacy-preserving access to your data. 
            This showcases innovation with CARV ID technology.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 space-y-8">
          {/* Mint CARV ID Section */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900">1. Mint Your CARV ID</h2>
            <p className="text-slate-600 mt-1">
              Claim your unique ERC-721 NFT to represent your digital identity and data ownership.
            </p>
            <div className="mt-4 space-y-4">
              <input
                type="text"
                placeholder="Enter desired CARV ID (e.g., 123)"
                value={mintingId}
                onChange={(e) => setMintingId(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={mintCarvId}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
              >
                Mint CARV ID NFT
              </button>
            </div>
          </div>

          {/* Grant Access Section */}
          <div className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-900">2. Grant Data Access</h2>
            <p className="text-slate-600 mt-1">
              Securely grant a research agent permission to use a specific type of your anonymized data.
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your CARV ID Token ID"
                value={grantingId}
                onChange={(e) => setGrantingId(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="AI Agent Wallet Address (e.g., 0x...)"
                value={grantAgentAddress}
                onChange={(e) => setGrantAgentAddress(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="mt-4">
              <select
                value={grantDataType}
                onChange={(e) => setGrantDataType(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Data Type</option>
                <option value="drug_discovery_data">Drug Discovery Data</option>
                <option value="genomic_data">Genomic Data</option>
                <option value="clinical_trial_data">Clinical Trial Data</option>
              </select>
            </div>
            <div className="mt-4">
              <button
                onClick={grantDataAccessException}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
              >
                Grant Access to Agent
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="border-t border-slate-200 pt-8">
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-3">How It Works</h3>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Your CARV ID NFT represents your digital identity on the blockchain</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">•</span>
                  <span>Data access permissions are granular and revocable</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>All data remains anonymized and privacy-preserving</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>AI agents can only access data you explicitly permit</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarvIdPage;
