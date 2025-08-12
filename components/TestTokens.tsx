'use client';

import React, { useState } from 'react';
import { Coins, AlertCircle, CheckCircle } from 'lucide-react';
import { PrimaryButton } from './buttons';
import { useUniSub } from '../lib/useUniSub';
import { useWeb3 } from '../lib/Web3Context';
import { useLanguage } from '../lib/LanguageContext';

interface TestTokensProps {
  className?: string;
}

export default function TestTokens({ className = '' }: TestTokensProps) {
  const { chainId, isConnected } = useWeb3();
  const { getMockUSDT, getUSDTBalance } = useUniSub();
  const { t } = useLanguage();
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('1000');
  const [balance, setBalance] = useState('');

  // 檢查是否在測試網
  const isTestnet = chainId === 2810 || chainId === 11155111;

  // 獲取測試代幣
  const handleGetTokens = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setMessage('請輸入有效的金額');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      
      await getMockUSDT(amount);
      
      // 更新餘額
      const newBalance = await getUSDTBalance();
      setBalance(newBalance);
      
      setMessage(`${t('testTokens.successMessage')} ${amount} ${t('testTokens.testUSDT')}！`);
    } catch (err: any) {
      console.error('獲取測試代幣失敗:', err);
      setMessage(`失敗: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 檢查餘額
  const checkBalance = async () => {
    try {
      const currentBalance = await getUSDTBalance();
      setBalance(currentBalance);
    } catch (err: any) {
      console.error('檢查餘額失敗:', err);
      setMessage(`檢查餘額失敗: ${err.message}`);
    }
  };

  if (!isConnected) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 ${className}`}>
        <div className="flex items-center space-x-3 mb-4">
          <Coins className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {t('testTokens.title')}
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          {t('common.connectWallet')}
        </p>
      </div>
    );
  }

  if (!isTestnet) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 ${className}`}>
        <div className="flex items-center space-x-3 mb-4">
          <Coins className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {t('testTokens.title')}
          </h3>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-yellow-700 dark:text-yellow-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{t('testTokens.switchToTestnet')}</span>
          </div>
          <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
            {t('testTokens.testnetOnly')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-4">
        <Coins className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {t('testTokens.getTestTokens')}
        </h3>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
        {t('testTokens.description')}
      </p>

      {/* 當前餘額 */}
      {balance && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{t('testTokens.currentBalance')}: {balance} USDT</span>
          </div>
        </div>
      )}

      {/* 金額輸入 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('testTokens.amount')} (USDT)
        </label>
        <input
          type="number"
          step="1"
          min="1"
          max="10000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={t('testTokens.amount')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* 操作按鈕 */}
      <div className="flex space-x-3 mb-4">
        <PrimaryButton
          onClick={handleGetTokens}
          disabled={loading}
          className="flex-1"
        >
          {loading ? t('testTokens.processing') : `${t('testTokens.getTokens')} ${amount} USDT`}
        </PrimaryButton>
        <button
          onClick={checkBalance}
          className="px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
        >
          {t('testTokens.checkBalance')}
        </button>
      </div>

      {/* 狀態消息 */}
      {message && (
        <div className={`p-3 rounded-lg ${
          message.includes('成功') ? 
          'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400' :
          'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
        }`}>
          <div className="flex items-center space-x-2">
            {message.includes('成功') ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{message}</span>
          </div>
        </div>
      )}

      {/* 使用提示 */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-xs text-blue-700 dark:text-blue-400">
          <strong>{t('testTokens.note')}:</strong> {t('testTokens.noteDescription')} {t('testTokens.usageNote')}
        </p>
      </div>
    </div>
  );
}
