'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, TrendingUp, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import MarketListingCard from './MarketListingCard';
import { PrimaryButton, SecondaryButton } from './buttons';
import { useUniSub } from '../lib/useUniSub';
import { useWeb3 } from '../lib/Web3Context';
import { useLanguage } from '../lib/LanguageContext';
import { MarketListing } from '../lib/contracts';

interface MarketplaceProps {
  className?: string;
}

export default function Marketplace({ className = '' }: MarketplaceProps) {
  const { userAddress, isConnected } = useWeb3();
  const { t } = useLanguage();
  const {
    loading,
    error,
    setError,
    getMarketListings,
    buyNFTFromMarket,
    cancelListing,
    getUSDTBalance
  } = useUniSub();

  const [listings, setListings] = useState<MarketListing[]>([]);
  const [usdtBalance, setUsdtBalance] = useState('0');
  const [refreshing, setRefreshing] = useState(false);
  const [operationLoading, setOperationLoading] = useState<{
    type: 'buy' | 'cancel' | null;
    listingId: string | null;
  }>({ type: null, listingId: null });

  // 載入市場數據
  const loadMarketData = async () => {
    if (!isConnected) return;

    try {
      setRefreshing(true);
      setError('');
      
      const [marketListings, balance] = await Promise.all([
        getMarketListings(),
        getUSDTBalance()
      ]);
      
      setListings(marketListings);
      setUsdtBalance(balance);
    } catch (err: any) {
      console.error('載入市場數據失敗:', err);
      setError(err.message || t('common.loadFailed'));
    } finally {
      setRefreshing(false);
    }
  };

  // 處理購買 NFT
  const handleBuyNFT = async (listingId: string) => {
    try {
      setOperationLoading({ type: 'buy', listingId });
      setError('');

      await buyNFTFromMarket(listingId);
      
      // 重新載入市場數據
      await loadMarketData();
      
      // 顯示成功訊息
      alert(t('marketplace.buySuccess'));
    } catch (err: any) {
      console.error('購買失敗:', err);
      alert(`${t('marketplace.buyFailed')}: ${err.message}`);
    } finally {
      setOperationLoading({ type: null, listingId: null });
    }
  };

  // 處理取消掛單
  const handleCancelListing = async (listingId: string) => {
    try {
      setOperationLoading({ type: 'cancel', listingId });
      setError('');

      await cancelListing(listingId);
      
      // 重新載入市場數據
      await loadMarketData();
      
      // 顯示成功訊息
      alert(t('marketplace.cancelSuccess'));
    } catch (err: any) {
      console.error('取消掛單失敗:', err);
      alert(`${t('marketplace.cancelFailed')}: ${err.message}`);
    } finally {
      setOperationLoading({ type: null, listingId: null });
    }
  };

  // 初始載入
  useEffect(() => {
    loadMarketData();
  }, [isConnected]);

  // 過濾和排序掛單
  const activeListing = listings.filter(listing => 
    new Date() <= listing.expirationTime
  );
  const expiredListings = listings.filter(listing => 
    new Date() > listing.expirationTime
  );

  if (!isConnected) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center ${className}`}>
        <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {t('marketplace.connectWallet')}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          {t('marketplace.connectWalletDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 標題和餘額 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('marketplace.title')}
            </h2>
          </div>
          <SecondaryButton
            onClick={loadMarketData}
            disabled={refreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? t('marketplace.refreshing') : t('marketplace.refresh')}</span>
          </SecondaryButton>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-300">
            {t('marketplace.description')}
          </p>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('marketplace.yourBalance')}</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              {usdtBalance} USDT
            </p>
          </div>
        </div>
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
      {loading && !refreshing && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">{t('marketplace.loadingData')}</p>
        </div>
      )}

      {/* 有效掛單 */}
      {activeListing.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {t('marketplace.availableNFTs')} ({activeListing.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeListing.map((listing) => (
              <MarketListingCard
                key={`${listing.subscriptionContract}-${listing.tokenId}`}
                listing={listing}
                onBuy={handleBuyNFT}
                onCancel={handleCancelListing}
                userAddress={userAddress}
                isLoading={
                  operationLoading.listingId === listing.listingId && 
                  (operationLoading.type === 'buy' || operationLoading.type === 'cancel')
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* 過期掛單 */}
      {expiredListings.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {t('marketplace.expiredListings')} ({expiredListings.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expiredListings.map((listing) => (
              <MarketListingCard
                key={`${listing.subscriptionContract}-${listing.tokenId}`}
                listing={listing}
                onBuy={handleBuyNFT}
                onCancel={handleCancelListing}
                userAddress={userAddress}
                isLoading={
                  operationLoading.listingId === listing.listingId && 
                  (operationLoading.type === 'buy' || operationLoading.type === 'cancel')
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* 無掛單狀態 */}
      {!loading && listings.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {t('marketplace.noListings')}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {t('marketplace.noListingsDesc')}
          </p>
          <SecondaryButton onClick={loadMarketData}>
            {t('marketplace.recheck')}
          </SecondaryButton>
        </div>
      )}
    </div>
  );
}
