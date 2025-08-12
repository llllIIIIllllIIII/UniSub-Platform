'use client';

import React, { useState, useEffect } from 'react';
import { Play, Clock, DollarSign, User, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './buttons';
import { useUniSub } from '../lib/useUniSub';
import { useWeb3 } from '../lib/Web3Context';
import { useLanguage } from '../lib/LanguageContext';
import { SubscriptionService, UserSubscriptionStatus, formatDuration } from '../lib/contracts';

interface ServiceBrowserProps {
  className?: string;
}

export default function ServiceBrowser({ className = '' }: ServiceBrowserProps) {
  const { userAddress, isConnected } = useWeb3();
  const { t } = useLanguage();
  const {
    loading,
    error,
    setError,
    getAllSubscriptionServices,
    purchaseSubscription,
    checkSubscriptionStatus,
    getUSDTBalance,
    testContractConnection
  } = useUniSub();

  const [services, setServices] = useState<SubscriptionService[]>([]);
  const [subscriptionStatuses, setSubscriptionStatuses] = useState<{[key: string]: UserSubscriptionStatus}>({});
  const [usdtBalance, setUsdtBalance] = useState('0');
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);

  // 載入服務數據
  const loadServicesData = async () => {
    if (!isConnected) return;

    try {
      setError('');
      const [allServices, balance] = await Promise.all([
        getAllSubscriptionServices(),
        getUSDTBalance()
      ]);

      setServices(allServices);
      setUsdtBalance(balance);

      // 檢查每個服務的訂閱狀態
      if (userAddress) {
        const statuses: {[key: string]: UserSubscriptionStatus} = {};
        for (const service of allServices) {
          const status = await checkSubscriptionStatus(service.address);
          statuses[service.address] = status;
        }
        setSubscriptionStatuses(statuses);
      }
    } catch (err: any) {
      console.error('載入服務數據失敗:', err);
      setError(err.message || '載入失敗');
    }
  };

  // 處理購買訂閱
  const handlePurchase = async (serviceAddress: string, serviceName: string) => {
    try {
      setPurchaseLoading(serviceAddress);
      setError('');

      await purchaseSubscription(serviceAddress);
      
      // 重新載入數據
      await loadServicesData();
      
      alert(`${t('services.purchaseSuccess')} ${serviceName} ${t('services.subscribe')}！`);
    } catch (err: any) {
      console.error('購買失敗:', err);
      alert(`購買失敗: ${err.message}`);
    } finally {
      setPurchaseLoading(null);
    }
  };

  // 格式化地址顯示
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // 檢查是否有足夠餘額
  const hasEnoughBalance = (price: string) => {
    return parseFloat(usdtBalance) >= parseFloat(price);
  };

  // 初始載入
  useEffect(() => {
    loadServicesData();
  }, [isConnected, userAddress]);

  if (!isConnected) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center ${className}`}>
        <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {t('services.connectWallet')}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          {t('services.connectWalletDescription')}
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
            <Play className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('services.subscriptionServices')}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('services.usdtBalance')}</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              {usdtBalance} USDT
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-300">
            {t('services.description')}
          </p>
          <SecondaryButton
            onClick={async () => {
              console.log('🔧 手動測試合約連接...');
              const result = await testContractConnection();
              alert(result ? '✅ 合約連接成功' : '❌ 合約連接失敗，請檢查控制台');
            }}
            className="text-sm px-3 py-1"
          >
            {t('services.testContract')}
          </SecondaryButton>
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
      {loading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">{t('services.loading')}</p>
        </div>
      )}

      {/* 服務列表 */}
      {!loading && services.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const status = subscriptionStatuses[service.address];
            const hasActiveSubscription = status?.hasActiveSubscription;
            const isLoading = purchaseLoading === service.address;
            const canAfford = hasEnoughBalance(service.price);

            return (
              <div
                key={service.address}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700"
              >
                {/* 服務資訊 */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {service.symbol}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                    <DollarSign className="w-5 h-5" />
                    <span className="text-2xl font-bold">{service.price}</span>
                    <span className="text-sm">USDT</span>
                  </div>
                </div>

                {/* 服務詳情 */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span>{t('services.subscriptionPeriod')}: {formatDuration(service.duration)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <User className="w-4 h-4" />
                    <span>{t('services.serviceProvider')}: {formatAddress(service.serviceProvider)}</span>
                  </div>
                </div>

                {/* 訂閱狀態 */}
                {hasActiveSubscription && (
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">{t('services.hasActiveSubscription')}</span>
                    </div>
                    {status?.expirationTime && (
                      <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                        {t('services.expirationTime')}: {status.expirationTime.toLocaleDateString()} {status.expirationTime.toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                )}

                {/* 餘額不足提示 */}
                {!canAfford && !hasActiveSubscription && (
                  <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-center space-x-2 text-yellow-700 dark:text-yellow-400">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">{t('services.insufficientBalance')}</span>
                    </div>
                    <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
                      {t('services.needAmount')} {service.price} USDT，{t('services.currentAmount')} {usdtBalance} USDT
                    </p>
                  </div>
                )}

                {/* 購買按鈕 */}
                <div className="space-y-2">
                  {hasActiveSubscription ? (
                    <div className="text-center text-green-600 dark:text-green-400 font-medium">
                      {t('services.purchased')}
                    </div>
                  ) : (
                    <PrimaryButton
                      onClick={() => handlePurchase(service.address, service.name)}
                      disabled={isLoading || !canAfford}
                      className="w-full"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{t('services.purchasing')}</span>
                        </div>
                      ) : !canAfford ? (
                        t('services.insufficientFunds')
                      ) : (
                        `${t('services.purchaseFor')} ${service.price} USDT`
                      )}
                    </PrimaryButton>
                  )}
                </div>

                {/* 合約地址 */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('services.contract')}: {formatAddress(service.address)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 無服務狀態 */}
      {!loading && services.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {t('services.noServicesAvailable')}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {t('services.noServicesDescription')}
          </p>
          <SecondaryButton onClick={loadServicesData}>
            {t('services.reload')}
          </SecondaryButton>
        </div>
      )}
    </div>
  );
}
