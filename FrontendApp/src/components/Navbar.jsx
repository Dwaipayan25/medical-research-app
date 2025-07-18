import React, { useState } from 'react';
import "../App.css";

const Navbar = ({ 
  userAddress, 
  connectWallet, 
  disconnectWallet, 
  currentPage, 
  setCurrentPage 
}) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
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
        { id: 'home', label: 'Dashboard', icon: '📊' },
        { id: 'howItWorks', label: 'How It Works', icon: '💡' },
        { id: 'carvId', label: 'CARV ID', icon: '🆔' },
        { id: 'aiAgent', label: 'AI Research', icon: '🔬' }
    ];

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">M</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">MediChain</span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setCurrentPage(item.id)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                    currentPage === item.id
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
                                }`}
                            >
                                <span className="mr-2">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Wallet Connection */}
                    <div className="flex items-center space-x-4">
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
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                                >
                                    Disconnect
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleConnectWallet}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
                            >
                                Connect Wallet
                            </button>
                        )}

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-gray-600 hover:text-indigo-600 p-2"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setCurrentPage(item.id);
                                    setMobileMenuOpen(false);
                                }}
                                className={`block w-full text-left px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                    currentPage === item.id
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
                                }`}
                            >
                                <span className="mr-2">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;