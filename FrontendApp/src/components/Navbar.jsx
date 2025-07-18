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

    const navItems = [
        { id: 'home', label: 'Dashboard' },
        { id: 'howItWorks', label: 'How It Works' },
        { id: 'carvId', label: 'CARV ID' },
        { id: 'aiAgent', label: 'AI Research' }
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-indigo-600">🏥 MediChain AI</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden sm:flex sm:space-x-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setCurrentPage(item.id)}
                                className={`nav-button ${currentPage === item.id ? 'active' : ''}`}
                                data-page={item.id}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Wallet Connection */}
                    <div className="flex items-center">
                        {userAddress ? (
                            <div className="flex items-center space-x-2">
                                <div className="hidden sm:flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-lg">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-green-700">
                                        {truncateAddress(userAddress)}
                                    </span>
                                </div>
                                <button
                                    onClick={handleConnectWallet}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                                >
                                    Disconnect
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleConnectWallet}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                            >
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
                {/* Mobile Navigation */}
                <div className="sm:hidden flex justify-around p-2 border-t border-slate-200">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentPage(item.id)}
                            className={`nav-button-mobile ${currentPage === item.id ? 'active' : ''}`}
                            data-page={item.id}
                        >
                            {item.id === 'howItWorks' ? 'Architecture' : item.id === 'aiAgent' ? 'Research' : item.label}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;