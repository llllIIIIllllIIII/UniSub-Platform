'use client';

import React, { useState, useEffect } from 'react';
import { Package, DollarSign, Calendar, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './buttons';
import { useUniSub } from '../lib/useUniSub';
import { useWeb3 } from '../lib/Web3Context';
import { useLanguage } from '../lib/LanguageContext';
import { UserSubscriptionStatus } from '../lib/contracts';

interface UserNFT {
  subscriptionContract: string;
  tokenIds: string[];
  serviceName: string;
  statuses: UserSubscriptionStatus[];
}

interface MyNFTsProps {
  className?: string;
}

export default function MyNFTs({ className = '' }: MyNFTsProps) {
  const { userAddress, isConnected } = useWeb3();
  const { t } = useLanguage();
  const {
    loading,
    error,
    setError,
    getUserSubscriptions,
    checkSubscriptionStatus,
    listNFTForSale
  } = useUniSub();

  const [userNFTs, setUserNFTs] = useState<UserNFT[]>([]);
  const [sellPrice, setSellPrice] = useState<{[key: string]: string}>({});
  const [showSellForm, setShowSellForm] = useState<{[key: string]: boolean}>({});
  const [sellLoading, setSellLoading] = useState<string | null>(null);

  // 載入用戶 NFT
  const loadUserNFTs = async () => {
    if (!isConnected || !userAddress) return;

    try {
      setError('');
      const subscriptions = await getUserSubscriptions();
      const nftsWithStatus: UserNFT[] = [];

      for (const sub of subscriptions) {
        const statuses = [];
        for (const tokenId of sub.tokenIds) {
          const status = await checkSubscriptionStatus(sub.subscriptionContract);
          statuses.push(status);
        }

        nftsWithStatus.push({
          ...sub,
          statuses
        });
      }

      setUserNFTs(nftsWithStatus);
    } catch (err: any) {
      console.error('載入用戶 NFT 失敗:', err);
      setError(err.message || t('common.loadFailed'));
    }
  };

  // 處理出售 NFT
  const handleSellNFT = async (subscriptionContract: string, tokenId: string) => {
    const key = `${subscriptionContract}-${tokenId}`;
    const price = sellPrice[key];

    if (!price || parseFloat(price) <= 0) {
      alert(t('myNFTs.priceRequired'));
      return;
    }

    try {
      setSellLoading(key);
      setError('');

      await listNFTForSale(subscriptionContract, tokenId, price);
      
      // 重新載入數據
      await loadUserNFTs();
      
      // 清理狀態
      setSellPrice({ ...sellPrice, [key]: '' });
      setShowSellForm({ ...showSellForm, [key]: false });
      
      alert(t('myNFTs.listingSuccess'));
    } catch (err: any) {
      console.error('掛單失敗:', err);
      alert(`${t('myNFTs.listingFailed')}: ${err.message}`);
    } finally {
      setSellLoading(null);
    }
  };

  // 切換出售表單顯示
  const toggleSellForm = (subscriptionContract: string, tokenId: string) => {
    const key = `${subscriptionContract}-${tokenId}`;
    setShowSellForm({
      ...showSellForm,
      [key]: !showSellForm[key]
    });
  };

  // 更新出售價格
  const updateSellPrice = (subscriptionContract: string, tokenId: string, price: string) => {
    const key = `${subscriptionContract}-${tokenId}`;
    setSellPrice({
      ...sellPrice,
      [key]: price
    });
  };

  // 格式化到期時間
  const formatExpirationTime = (time: Date) => {
    const now = new Date();
    const diff = time.getTime() - now.getTime();
    
    if (diff <= 0) {
      return { text: t('myNFTs.expired'), expired: true };
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return { text: `${days} ${t('myNFTs.days')} ${hours} ${t('common.hours')}後過期`, expired: false };
    }
    return { text: `${hours} ${t('common.hours')}後過期`, expired: false };
  };

  // 初始載入
  useEffect(() => {
    loadUserNFTs();
  }, [isConnected, userAddress]);

  if (!isConnected) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center ${className}`}>
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {t('myNFTs.connectWallet')}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          {t('myNFTs.connectWalletDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 標題 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Package className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('myNFTs.title')}
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          {t('myNFTs.description')}
        </p>
      </div>

      {/* 錯誤提示 */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* 載入狀態 */}
      {loading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">{t('myNFTs.loadingNFTs')}</p>
        </div>
      )}

      {/* NFT 列表 */}
      {!loading && userNFTs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userNFTs.map((nft) =>
            nft.tokenIds.map((tokenId, index) => {
              const status = nft.statuses[index];
              const key = `${nft.subscriptionContract}-${tokenId}`;
              const expirationInfo = status.expirationTime ? 
                formatExpirationTime(status.expirationTime) : 
                { text: '未知狀態', expired: false };

              return (
                <div
                  key={key}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border ${
                    expirationInfo.expired ? 
                      'border-red-200 dark:border-red-800' : 
                      'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {/* NFT 資訊 */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {nft.serviceName}
                    </h3>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Token ID:</span>
                        <span className="ml-2 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          #{tokenId}
                        </span>
                      </p>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span className={expirationInfo.expired ? 
                          'text-red-600 dark:text-red-400' : 
                          'text-gray-600 dark:text-gray-300'
                        }>
                          {expirationInfo.text}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 狀態提示 */}
                  {expirationInfo.expired && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">{t('myNFTs.expired')}</span>
                      </div>
                    </div>
                  )}

                  {/* 出售按鈕 */}
                  {!showSellForm[key] && (
                    <PrimaryButton
                      onClick={() => toggleSellForm(nft.subscriptionContract, tokenId)}
                      className="w-full mb-2"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      {t('myNFTs.listForSale')}
                    </PrimaryButton>
                  )}

                  {/* 出售表單 */}
                  {showSellForm[key] && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('myNFTs.sellPrice')} (USDT)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="例如: 10.5"
                          value={sellPrice[key] || ''}
                          onChange={(e) => updateSellPrice(nft.subscriptionContract, tokenId, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                   focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <PrimaryButton
                          onClick={() => handleSellNFT(nft.subscriptionContract, tokenId)}
                          disabled={sellLoading === key}
                          className="flex-1"
                        >
                          {sellLoading === key ? t('myNFTs.listing') : t('common.confirm')}
                        </PrimaryButton>
                        <SecondaryButton
                          onClick={() => toggleSellForm(nft.subscriptionContract, tokenId)}
                          disabled={sellLoading === key}
                        >
                          {t('common.cancel')}
                        </SecondaryButton>
                      </div>
                    </div>
                  )}

                  {/* 合約地址 */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('services.contract')}: {nft.subscriptionContract.slice(0, 6)}...{nft.subscriptionContract.slice(-4)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 無 NFT 狀態 */}
      {!loading && userNFTs.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {t('myNFTs.noNFTs')}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {t('myNFTs.noNFTsDesc')}
          </p>
          <SecondaryButton onClick={loadUserNFTs}>
            {t('marketplace.recheck')}
          </SecondaryButton>
        </div>
      )}
    </div>
  );
}
