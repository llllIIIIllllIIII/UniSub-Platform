'use client';

import React from 'react';
import { Clock, User, DollarSign, Calendar } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './buttons';
import { MarketListing } from '../lib/contracts';
import { isSubscriptionExpired } from '../lib/contracts';

interface MarketListingCardProps {
  listing: MarketListing;
  onBuy: (listingId: string) => void;
  onCancel?: (listingId: string) => void;
  userAddress?: string;
  isLoading?: boolean;
}

export default function MarketListingCard({ 
  listing, 
  onBuy, 
  onCancel, 
  userAddress, 
  isLoading = false 
}: MarketListingCardProps) {
  const isExpired = isSubscriptionExpired(listing.expirationTime);
  const isOwner = userAddress && userAddress.toLowerCase() === listing.seller.toLowerCase();
  
  // 格式化地址顯示
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // 格式化到期時間
  const formatExpirationTime = (time: Date) => {
    const now = new Date();
    const diff = time.getTime() - now.getTime();
    
    if (diff <= 0) {
      return '已過期';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} 天 ${hours} 小時後過期`;
    }
    return `${hours} 小時後過期`;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border ${
      isExpired ? 'border-red-200 dark:border-red-800' : 'border-gray-200 dark:border-gray-700'
    }`}>
      {/* 服務資訊 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {listing.serviceName}
          </h3>
          {listing.serviceSymbol && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {listing.serviceSymbol}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
          <DollarSign className="w-5 h-5" />
          <span className="text-xl font-bold">{listing.price} USDT</span>
        </div>
      </div>

      {/* NFT 詳情 */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <span className="font-medium">Token ID:</span>
          <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            #{listing.tokenId}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <User className="w-4 h-4" />
          <span>賣家:</span>
          <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {formatAddress(listing.seller)}
          </span>
          {isOwner && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
              我的掛單
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="w-4 h-4" />
          <span className={isExpired ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}>
            {formatExpirationTime(listing.expirationTime)}
          </span>
        </div>
      </div>

      {/* 狀態提示 */}
      {isExpired && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">此訂閱已過期</span>
          </div>
        </div>
      )}

      {/* 操作按鈕 */}
      <div className="flex space-x-3">
        {isOwner ? (
          <SecondaryButton
            onClick={() => onCancel && onCancel(listing.listingId)}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? '取消中...' : '取消掛單'}
          </SecondaryButton>
        ) : (
          <PrimaryButton
            onClick={() => onBuy(listing.listingId)}
            disabled={isLoading || isExpired}
            className="flex-1"
          >
            {isLoading ? '購買中...' : isExpired ? '已過期' : `購買 ${listing.price} USDT`}
          </PrimaryButton>
        )}
      </div>

      {/* 合約地址 */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          合約: {formatAddress(listing.subscriptionContract)}
        </p>
      </div>
    </div>
  );
}
