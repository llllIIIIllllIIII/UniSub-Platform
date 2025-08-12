'use client';

import Link from 'next/link';
import { Wallet, ChevronDown, AlertTriangle, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import LanguageSwitch from './LanguageSwitch';
import { useWeb3 } from '../lib/Web3Context';
import { useLanguage } from '../lib/LanguageContext';

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className = '' }: NavbarProps) {
  const { 
    isConnected, 
    userAddress, 
    ethBalance,
    chainId,
    networkName,
    isCorrectNetwork, 
    connectWallet, 
    disconnectWallet, 
    switchToSepolia,
    switchToMorphHolesky,
    switchToNetwork,
    isLoading, 
    error 
  } = useWeb3();
  
  const { t } = useLanguage();

  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  // 複製地址到剪貼板
  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(userAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('複製失敗:', error);
    }
  };

  // 格式化地址顯示
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // 獲取區塊鏈瀏覽器 URL
  const getExplorerUrl = (address: string) => {
    switch (chainId) {
      case 2810: // Morph Holesky
        return `https://explorer-holesky.morphl2.io/address/${address}`;
      case 11155111: // Sepolia
        return `https://sepolia.etherscan.io/address/${address}`;
      default:
        return `https://sepolia.etherscan.io/address/${address}`;
    }
  };

  // 獲取瀏覽器名稱
  const getExplorerName = () => {
    switch (chainId) {
      case 2810: // Morph Holesky
        return 'Morph Explorer';
      case 11155111: // Sepolia
        return 'Etherscan';
      default:
        return 'Etherscan';
    }
  };

  // 處理網路切換
  const handleNetworkSwitch = () => {
    if (chainId === 2810) {
      // 如果在 Morph Holesky，切換到 Sepolia
      switchToSepolia();
    } else {
      // 否則切換到 Morph Holesky
      switchToMorphHolesky();
    }
  };

  return (
    <nav className={`bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-brand-light-blue/20 dark:border-dark-surface/50 sticky top-0 z-50 transition-all duration-300 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-purple to-brand-blue rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="text-xl font-bold text-brand-dark dark:text-dark-text group-hover:text-brand-purple dark:group-hover:text-brand-light-blue transition-colors duration-300">
              Unisub
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/consumer" 
              className="text-brand-dark dark:text-dark-text hover:text-brand-purple dark:hover:text-brand-light-blue transition-colors duration-300 font-medium"
            >
              {t('nav.consumer')}
            </Link>
            <Link 
              href="/provider" 
              className="text-brand-dark dark:text-dark-text hover:text-brand-purple dark:hover:text-brand-light-blue transition-colors duration-300 font-medium"
            >
              {t('nav.provider')}
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Language Switch */}
            <LanguageSwitch />
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* 錯誤顯示 */}
            {error && !isLoading && (
              <div className="text-red-500 text-sm max-w-48 truncate" title={error}>
                {error}
              </div>
            )}

            {/* Wallet Section */}
            {!isConnected ? (
              /* Connect Wallet Button */
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-gradient-to-r from-brand-purple to-brand-blue hover:from-brand-blue hover:to-brand-purple text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wallet size={18} />
                <span className="text-sm">
                  {isLoading ? t('common.loading') : t('nav.connectWallet')}
                </span>
              </button>
            ) : (
              /* Connected Wallet Dropdown */
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
                    isCorrectNetwork 
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700' 
                      : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700'
                  }`}
                >
                  <Wallet size={18} />
                  <span className="text-sm">{formatAddress(userAddress)}</span>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-card rounded-xl shadow-lg border border-gray-200 dark:border-dark-surface overflow-hidden z-50">
                    {/* Account Info */}
                    <div className="p-4 border-b border-gray-200 dark:border-dark-surface">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-dark-text-secondary">Account</span>
                        <button
                          onClick={copyAddress}
                          className="flex items-center space-x-1 text-brand-purple hover:text-brand-blue transition-colors"
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                          <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="text-brand-dark dark:text-dark-text font-mono text-sm break-all">
                        {userAddress}
                      </div>
                    </div>

                    {/* Balance */}
                    <div className="p-4 border-b border-gray-200 dark:border-dark-surface">
                      <div className="text-sm font-medium text-gray-600 dark:text-dark-text-secondary mb-1">Balance</div>
                      <div className="text-brand-dark dark:text-dark-text font-medium">
                        {parseFloat(ethBalance).toFixed(4)} ETH
                      </div>
                    </div>

                    {/* Network Status */}
                    <div className="p-4 border-b border-gray-200 dark:border-dark-surface">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-600 dark:text-dark-text-secondary mb-1">Network</div>
                          <div className={`text-sm font-medium ${
                            isCorrectNetwork 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-yellow-600 dark:text-yellow-400'
                          }`}>
                            {isCorrectNetwork ? networkName : 'Unsupported Network'}
                          </div>
                          {chainId && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Chain ID: {chainId}
                            </div>
                          )}
                        </div>
                        {!isCorrectNetwork && (
                          <button
                            onClick={handleNetworkSwitch}
                            className="flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-lg text-xs hover:bg-yellow-200 dark:hover:bg-yellow-900/40 transition-colors"
                          >
                            <AlertTriangle size={12} />
                            <span>Switch</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4">
                      <div className="space-y-2">
                        <a
                          href={getExplorerUrl(userAddress)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between w-full p-2 text-sm text-gray-600 dark:text-dark-text-secondary hover:text-brand-purple dark:hover:text-brand-light-blue transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface"
                        >
                          <span>View on {getExplorerName()}</span>
                          <ExternalLink size={14} />
                        </a>
                        <button
                          onClick={() => {
                            disconnectWallet();
                            setShowDropdown(false);
                          }}
                          className="w-full p-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
                        >
                          {t('nav.disconnect')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu - Simple version */}
      <div className="md:hidden px-4 pb-4 border-t border-brand-light-blue/20 dark:border-dark-surface/50 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md">
        <div className="flex flex-col space-y-2 pt-4">
          <Link 
            href="/consumer" 
            className="text-brand-dark dark:text-dark-text hover:text-brand-purple dark:hover:text-brand-light-blue transition-colors duration-300 font-medium py-2"
          >
            {t('nav.consumer')}
          </Link>
          <Link 
            href="/provider" 
            className="text-brand-dark dark:text-dark-text hover:text-brand-purple dark:hover:text-brand-light-blue transition-colors duration-300 font-medium py-2"
          >
            {t('nav.provider')}
          </Link>
          
          {/* Mobile Wallet Info */}
          {isConnected && (
            <div className="pt-2 border-t border-gray-200 dark:border-dark-surface mt-2">
              <div className="text-sm text-gray-600 dark:text-dark-text-secondary mb-1">Connected: {formatAddress(userAddress)}</div>
              <div className="text-sm text-gray-600 dark:text-dark-text-secondary mb-1">Balance: {parseFloat(ethBalance).toFixed(4)} ETH</div>
              <div className={`text-sm mb-2 ${isCorrectNetwork ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                Network: {networkName} {chainId && `(${chainId})`}
              </div>
              {!isCorrectNetwork && (
                <button
                  onClick={handleNetworkSwitch}
                  className="w-full mb-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 px-3 py-2 rounded-lg text-sm hover:bg-yellow-200 dark:hover:bg-yellow-900/40 transition-colors"
                >
                  Switch Network
                </button>
              )}
              <button
                onClick={disconnectWallet}
                className="w-full bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-2 rounded-lg text-sm hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
              >
                {t('nav.disconnect')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </nav>
  );
}
