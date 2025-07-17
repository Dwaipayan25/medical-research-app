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
    <div className="min-h-screen bg-gray-900 text-gray-100 font-inter">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-purple-400 mb-8">
            CARV ID Management
          </h1>

          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 lg:p-12 space-y-8">
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg space-y-6 border border-purple-500">
              <h2 className="text-xl sm:text-2xl font-semibold text-purple-300">Patient Data Ownership</h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Manage your CARV ID (ERC-721 NFT) and grant/revoke access to anonymized medical data for AI agents.
              </p>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter desired CARV ID (e.g., 123)"
                  value={mintingId}
                  onChange={(e) => setMintingId(e.target.value)}
                  className="w-full p-3 sm:p-4 rounded-lg bg-gray-600 border border-gray-500 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                />
                <button
                  onClick={mintCarvId}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-4 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 text-sm sm:text-base"
                >
                  Mint My CARV ID NFT
                </button>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-600">
                <h3 className="text-lg sm:text-xl font-medium text-purple-200">Grant Data Access</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Your CARV ID Token ID"
                    value={grantingId}
                    onChange={(e) => setGrantingId(e.target.value)}
                    className="w-full p-3 sm:p-4 rounded-lg bg-gray-600 border border-gray-500 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    placeholder="AI Agent Wallet Address (e.g., 0x...)"
                    value={grantAgentAddress}
                    onChange={(e) => setGrantAgentAddress(e.target.value)}
                    className="w-full p-3 sm:p-4 rounded-lg bg-gray-600 border border-gray-500 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    placeholder="Data Type (e.g., 'drug_discovery_data')"
                    value={grantDataType}
                    onChange={(e) => setGrantDataType(e.target.value)}
                    className="w-full p-3 sm:p-4 rounded-lg bg-gray-600 border border-gray-500 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  />
                </div>
                <button
                  onClick={grantDataAccessException}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 sm:py-4 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 text-sm sm:text-base"
                >
                  Grant Access to Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarvIdPage;