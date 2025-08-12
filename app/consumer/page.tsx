'use client';

import { useState } from 'react';
import { 
  Wallet, 
  ShoppingCart, 
  Package,
  Coins,
  PlayCircle,
  TrendingUp
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/footer';
import { PrimaryButton, SecondaryButton } from '../../components/buttons';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useWeb3 } from '../../lib/Web3Context';
import { useLanguage } from '../../lib/LanguageContext';
import ServiceBrowser from '../../components/ServiceBrowser';
import Marketplace from '../../components/Marketplace';
import MyNFTs from '../../components/MyNFTs';
import TestTokens from '../../components/TestTokens';

export default function ConsumerPage() {
  const { 
    isConnected, 
    userAddress, 
    ethBalance, 
    chainId,
    networkName,
    isCorrectNetwork,
    connectWallet,
    switchToMorphHolesky,
    isLoading: walletLoading
  } = useWeb3();
  
  const { t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState<'browse' | 'market' | 'nfts' | 'tokens'>('browse');

  // 標籤配置
  const tabs = [
    { id: 'browse', label: t('consumer.tabs.browse'), icon: PlayCircle, description: t('consumer.tabs.browseDesc') },
    { id: 'market', label: t('consumer.tabs.market'), icon: TrendingUp, description: t('consumer.tabs.marketDesc') },
    { id: 'nfts', label: t('consumer.tabs.nfts'), icon: Package, description: t('consumer.tabs.nftsDesc') },
    { id: 'tokens', label: t('consumer.tabs.tokens'), icon: Coins, description: t('consumer.tabs.tokensDesc') }
  ] as const;

  if (walletLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* 頁面標題 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('consumer.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('consumer.subtitle')}
          </p>
        </div>

        {/* 錢包連接狀態 */}
        {!isConnected ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center mb-8">
            <Wallet className="w-16 h-16 text-indigo-600 dark:text-indigo-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('consumer.connectWallet')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('consumer.connectWalletDescription')}
            </p>
            <PrimaryButton onClick={connectWallet} className="px-8 py-3">
              {t('nav.connectWallet')}
            </PrimaryButton>
          </div>
        ) : (
          <>
            {/* 網路狀態檢查 */}
            {!isCorrectNetwork && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-2">
                      {t('consumer.networkMismatch')}
                    </h3>
                    <p className="text-yellow-700 dark:text-yellow-300">
                      {t('consumer.networkMismatchDescription')}
                    </p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                      {t('consumer.currentNetwork')}: {networkName} (Chain ID: {chainId})
                    </p>
                  </div>
                  <SecondaryButton onClick={switchToMorphHolesky}>
                    {t('consumer.switchToMorph')}
                  </SecondaryButton>
                </div>
              </div>
            )}

            {/* 用戶資訊卡片 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {t('consumer.walletAddress')}
                  </h3>
                  <p className="text-lg font-mono text-gray-900 dark:text-white">
                    {userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : t('consumer.notConnected')}
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {t('consumer.ethBalance')}
                  </h3>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {ethBalance} ETH
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {t('consumer.network')}
                  </h3>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {networkName}
                  </p>
                </div>
              </div>
            </div>

            {/* 功能標籤 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-8">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
              
              {/* 標籤說明 */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {tabs.find(tab => tab.id === activeTab)?.description}
                </p>
              </div>
            </div>

            {/* 標籤內容 */}
            <div className="min-h-[400px]">
              {activeTab === 'browse' && (
                <ServiceBrowser />
              )}
              
              {activeTab === 'market' && (
                <Marketplace />
              )}
              
              {activeTab === 'nfts' && (
                <MyNFTs />
              )}
              
              {activeTab === 'tokens' && (
                <div className="max-w-md mx-auto">
                  <TestTokens />
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
