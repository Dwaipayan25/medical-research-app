import React from 'react';

const HomePage = () => {
  const technologies = [
    {
      name: "CARV SVM Chain",
      image: "https://placehold.co/300x200/2a9d8f/ffffff?text=CARV+SVM+Chain",
      general: "High-throughput, Solana-VM execution settled onto Ethereum for finality; designed as an AI agentic infrastructure.",
      useCase: "The conceptual environment for deploying and orchestrating AI agents, leveraging its on-chain execution and shared memory for verifiable and collaborative medical research."
    },
    {
      name: "CARV D.A.T.A. Framework",
      image: "https://placehold.co/300x200/e9c46a/000000?text=CARV+D.A.T.A.",
      general: "Data Authentication, Trust, and Attestation framework for securely bridging on-chain and off-chain data.",
      useCase: "Securely orchestrating and making anonymized multi-chain/off-chain medical data available to AI agents, ensuring privacy and verifiability."
    },
    {
      name: "CARV ID (ERC-7231)",
      image: "https://placehold.co/300x200/f4a261/000000?text=CARV+ID",
      general: "A persistent, composable identity standard (ERC-7231) that aggregates cross-chain and off-chain identities.",
      useCase: "Managing patient identity and granting granular, verifiable data access permissions to AI agents for research, ensuring patient data ownership and privacy."
    },
    {
      name: "Gemini API (Google LLMs)",
      image: "https://placehold.co/300x200/e76f51/ffffff?text=Gemini+API",
      general: "Provides access to powerful Large Language Models for understanding, generating, and processing natural language.",
      useCase: "Enhancing user experience by providing AI-powered summaries of research findings, suggesting next research steps, and explaining complex medical terms."
    }
  ];

  const handleLaunchApp = () => {
    // Add navigation logic here
    console.log('Launch App clicked');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-inter">
      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
            Decentralized AI Medical Research Network
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Revolutionizing medical research through privacy-preserving AI agents, 
            secure data orchestration, and patient-controlled identity management 
            on a decentralized infrastructure.
          </p>
          <button 
            onClick={handleLaunchApp}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 animate-pulse"
          >
            🚀 Launch App
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="px-6 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            About This Project
          </h2>
          <div className="bg-gray-800 rounded-xl p-8 lg:p-12 shadow-2xl border border-gray-700">
            <p className="text-lg lg:text-xl text-gray-300 leading-relaxed mb-6">
              Medical research today faces critical challenges: <span className="text-cyan-400 font-semibold">data silos</span> that 
              prevent comprehensive analysis, <span className="text-purple-400 font-semibold">privacy concerns</span> that limit 
              data sharing, and <span className="text-pink-400 font-semibold">centralized systems</span> that create single 
              points of failure and trust issues.
            </p>
            <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
              Our Decentralized AI Medical Research Network addresses these challenges by creating a 
              <span className="text-emerald-400 font-semibold"> secure, privacy-preserving ecosystem</span> where AI agents 
              can collaborate on medical research while patients maintain full control over their data. Through advanced 
              cryptographic techniques, decentralized identity management, and verifiable computation, we enable 
              groundbreaking research without compromising individual privacy or data sovereignty.
            </p>
          </div>
        </div>
      </section>

      {/* Technologies Used Section */}
      <section className="px-6 py-16 lg:py-24 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Key Technologies & Their Role
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {technologies.map((tech, index) => (
              <div 
                key={index} 
                className="bg-gray-800 rounded-xl p-6 lg:p-8 shadow-2xl border border-gray-700 hover:border-purple-500/50 transform hover:scale-105 transition-all duration-300 group"
              >
                <div className="mb-6">
                  <img 
                    src={tech.image} 
                    alt={tech.name}
                    className="w-full h-48 object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors duration-300">
                  {tech.name}
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-2">
                      General Description
                    </h4>
                    <p className="text-gray-300 leading-relaxed">
                      {tech.general}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-2">
                      Use Case in This Project
                    </h4>
                    <p className="text-gray-300 leading-relaxed">
                      {tech.useCase}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="px-6 py-16 lg:py-24 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white">
            Ready to Transform Medical Research?
          </h2>
          <p className="text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed">
            Join the revolution in privacy-preserving, decentralized medical research. 
            Your data, your control, limitless possibilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={handleLaunchApp}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
            >
              🔬 Start Research
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 text-lg font-bold px-8 py-4 rounded-xl transition-all duration-300 w-full sm:w-auto">
              📚 Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
