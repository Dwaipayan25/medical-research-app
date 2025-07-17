import React from 'react';
import "../App.css";

const Navbar = ({ 
  userAddress, 
  connectWallet, 
  disconnectWallet, 
  currentPage, 
  setCurrentPage 
}) => {
    const handleConnectWallet = () => {
        if (userAddress) {
            disconnectWallet();
        } else {
            connectWallet();
        }
    };

    const truncateAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 shadow-lg backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex space-x-2">
                        <button 
                            onClick={() => setCurrentPage('home')}
                            className={`px-4 py-2 rounded-xl transition-all duration-300 font-semibold transform hover:scale-105 backdrop-blur-sm ${
                                currentPage === 'home' 
                                    ? 'bg-white/30 text-white' 
                                    : 'text-white hover:text-yellow-300 hover:bg-white/20'
                            }`}
                        >
                            🏠 Home
                        </button>
                        <button 
                            onClick={() => setCurrentPage('carvId')}
                            className={`px-4 py-2 rounded-xl transition-all duration-300 font-semibold transform hover:scale-105 backdrop-blur-sm ${
                                currentPage === 'carvId' 
                                    ? 'bg-white/30 text-white' 
                                    : 'text-white hover:text-yellow-300 hover:bg-white/20'
                            }`}
                        >
                            🪪 CARV ID
                        </button>
                        <button 
                            onClick={() => setCurrentPage('aiAgent')}
                            className={`px-4 py-2 rounded-xl transition-all duration-300 font-semibold transform hover:scale-105 backdrop-blur-sm ${
                                currentPage === 'aiAgent' 
                                    ? 'bg-white/30 text-white' 
                                    : 'text-white hover:text-yellow-300 hover:bg-white/20'
                            }`}
                        >
                            🔬 AI Research
                        </button>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <span className="text-xl font-bold text-white drop-shadow-md bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                            🧬 Medical Research App
                        </span>
                        
                        {userAddress ? (
                            <div className="flex items-center space-x-2">
                                <span className="text-white text-sm bg-white/20 px-3 py-2 rounded-full backdrop-blur-sm">
                                    {truncateAddress(userAddress)}
                                </span>
                                <button 
                                    className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-6 py-2 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    onClick={handleConnectWallet}
                                >
                                    🔌 Disconnect
                                </button>
                            </div>
                        ) : (
                            <button 
                                className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-6 py-2 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 animate-pulse"
                                onClick={handleConnectWallet}
                            >
                                🔗 Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;