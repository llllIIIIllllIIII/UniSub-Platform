'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 翻譯字典
const translations = {
  zh: {
    // 導航欄
    'nav.home': '首頁',
    'nav.consumer': '消費者',
    'nav.provider': '服務商',
    'nav.history': '交易紀錄',
    'nav.subscriptions': '我的訂閱',
    'nav.transfer': '轉帳',
    'nav.connectWallet': '連接錢包',
    'nav.disconnect': '斷開錢包',
    'nav.language': '語言',

    // 首頁
    'home.title': '去中心化訂閱管理平台',
    'home.subtitle': '基於區塊鏈的 NFT 訂閱系統，安全、透明、可轉讓',
    'home.forConsumers': '消費者',
    'home.forProviders': '服務商',
    'home.getStarted': '開始使用',
    'home.consumers.title': '購買並管理訂閱',
    'home.consumers.desc': '瀏覽各種訂閱服務，安全購買，隨時在市場上轉售',
    'home.providers.title': '創建訂閱服務',
    'home.providers.desc': '輕鬆創建您的訂閱服務，接觸更多用戶，零手續費市場',
    'home.features.title': '主要功能',
    'home.features.description': '我們通過讓傳統訂閱模式變得可轉讓、可管理且有價值來解決其問題',
    'home.features.nft': 'NFT 訂閱',
    'home.features.nftDesc': '每個訂閱都是獨一無二的 NFT，可轉讓、可交易',
    'home.features.marketplace': '內建市場',
    'home.features.marketplaceDesc': '零手續費的 P2P 交易市場，隨時買賣訂閱',
    'home.features.secure': '安全透明',
    'home.features.secureDesc': '基於智能合約，所有交易公開透明且不可篡改',

    // 消費者頁面
    'consumer.title': 'UniSub Consumer',
    'consumer.subtitle': '發現、購買和管理您的去中心化訂閱服務',
    'consumer.connectWallet': '連接您的錢包',
    'consumer.connectWalletDescription': '連接錢包開始使用 UniSub 的所有功能',
    'consumer.networkMismatch': '網路不匹配',
    'consumer.networkMismatchDescription': '請切換到支援的測試網絡來使用 UniSub 功能',
    'consumer.currentNetwork': '當前網路',
    'consumer.switchToMorph': '切換到 Morph Holesky',
    'consumer.walletAddress': '錢包地址',
    'consumer.ethBalance': 'ETH 餘額',
    'consumer.network': '網路',
    'consumer.notConnected': '未連接',
    'consumer.tabs.browse': '訂閱服務',
    'consumer.tabs.market': '訂閱市場',
    'consumer.tabs.nfts': '我的訂閱',
    'consumer.tabs.tokens': '測試代幣',
    'consumer.tabs.browseDesc': '瀏覽並購買訂閱服務',
    'consumer.tabs.marketDesc': '買賣訂閱服務',
    'consumer.tabs.nftsDesc': '管理您的訂閱服務',
    'consumer.tabs.tokensDesc': '獲取測試 USDT',

    // 服務瀏覽
    'services.title': '可用訂閱服務',
    'services.refresh': '重新整理',
    'services.refreshing': '載入中...',
    'services.noServices': '目前沒有可用的訂閱服務',
    'services.price': '價格',
    'services.duration': '期限',
    'services.days': '天',
    'services.provider': '服務商',
    'services.subscribe': '訂閱',
    'services.subscribing': '訂閱中...',
    'services.connectWallet': '連接錢包購買訂閱',
    'services.connectWalletDescription': '請先連接您的錢包來瀏覽和購買訂閱服務',
    'services.subscriptionServices': '訂閱服務',
    'services.description': '選擇並購買您需要的訂閱服務，每個購買都會鑄造一個 NFT 到您的錢包',
    'services.loading': '載入訂閱服務中...',
    'services.subscriptionPeriod': '訂閱期限',
    'services.serviceProvider': '服務商',
    'services.purchaseSuccess': '成功購買',
    'services.usdtBalance': '您的 USDT 餘額',
    'services.testContract': '測試合約',
    'services.hasActiveSubscription': '您已擁有有效訂閱',
    'services.expirationTime': '到期時間',
    'services.insufficientBalance': 'USDT 餘額不足',
    'services.needAmount': '需要',
    'services.currentAmount': '您目前有',
    'services.purchased': '✓ 已購買',
    'services.purchasing': '購買中...',
    'services.insufficientFunds': '餘額不足',
    'services.purchaseFor': '購買',
    'services.contract': '合約地址',
    'services.noServicesAvailable': '沒有可用的服務',
    'services.noServicesDescription': '目前沒有可購買的訂閱服務，請稍後再來看看',
    'services.reload': '重新載入',

    // Test Tokens
    'testTokens.title': '測試代幣',
    'testTokens.getTestTokens': '獲取測試 USDT',
    'testTokens.description': '免費獲取測試 USDT 來試用訂閱功能（僅限測試網）',
    'testTokens.switchToTestnet': '請切換到測試網絡',
    'testTokens.testnetOnly': '測試代幣功能僅在 Morph Holesky 或 Sepolia 測試網上可用',
    'testTokens.amount': '數量',
    'testTokens.getTokens': '獲取代幣',
    'testTokens.getting': '獲取中...',
    'testTokens.processing': '處理中...',
    'testTokens.checkBalance': '檢查餘額',
    'testTokens.successMessage': '成功獲得',
    'testTokens.testUSDT': '測試 USDT',
    'testTokens.note': '提示',
    'testTokens.noteDescription': '測試代幣僅用於測試目的，不具有任何實際價值。',
    'testTokens.usageNote': '您可以使用這些代幣來測試購買訂閱和市場交易功能。',

    // 市場
    'marketplace.title': '訂閱市場',
    'marketplace.description': '發現並購買其他用戶的訂閱服務，或出售您自己的訂閱',
    'marketplace.balance': 'USDT 餘額',
    'marketplace.yourBalance': '您的 USDT 餘額',
    'marketplace.refresh': '刷新',
    'marketplace.refreshing': '刷新中',
    'marketplace.loadingData': '載入市場數據中...',
    'marketplace.connectWallet': '連接錢包使用市場',
    'marketplace.connectWalletDesc': '請先連接您的錢包來瀏覽和購買訂閱服務',
    'marketplace.availableNFTs': '可購買的訂閱',
    'marketplace.expiredListings': '過期的掛單',
    'marketplace.noListings': '目前沒有掛單',
    'marketplace.noListingsDesc': '市場上暫時沒有可購買的訂閱服務，請稍後再來看看',
    'marketplace.recheck': '重新檢查',
    'marketplace.buySuccess': '購買成功！',
    'marketplace.buyFailed': '購買失敗',
    'marketplace.cancelSuccess': '掛單已取消！',
    'marketplace.cancelFailed': '取消掛單失敗',
    'marketplace.seller': '賣家',
    'marketplace.expires': '到期時間',
    'marketplace.buy': '購買',
    'marketplace.buying': '購買中...',
    'marketplace.cancel': '取消掛單',
    'marketplace.canceling': '取消中...',
    'marketplace.expired': '已過期',

    // 我的訂閱
    'myNFTs.title': '我的訂閱服務',
    'myNFTs.description': '管理您擁有的訂閱服務，您可以出售給其他用戶',
    'myNFTs.noNFTs': '您還沒有任何訂閱服務',
    'myNFTs.noNFTsDesc': '購買一些訂閱服務來獲得您的第一個訂閱',
    'myNFTs.connectWallet': '連接錢包查看您的訂閱',
    'myNFTs.connectWalletDesc': '請先連接您的錢包來查看您擁有的訂閱服務',
    'myNFTs.loadingNFTs': '載入您的訂閱中...',
    'myNFTs.tokenId': 'Token ID',
    'myNFTs.validUntil': '有效期至',
    'myNFTs.expired': '已過期',
    'myNFTs.active': '有效',
    'myNFTs.sellPrice': '出售價格',
    'myNFTs.sellDuration': '掛單期限',
    'myNFTs.listForSale': '掛單出售',
    'myNFTs.listing': '掛單中...',
    'myNFTs.cancel': '取消',
    'myNFTs.priceRequired': '請輸入有效的價格',
    'myNFTs.listingSuccess': '成功掛單出售！',
    'myNFTs.listingFailed': '掛單失敗',
    'myNFTs.days': '天',

    // 服務商頁面
    'provider.title': '服務商中心',
    'provider.description': '創建和管理您的訂閱服務',
    'provider.manageServices': '管理您的訂閱服務',
    'provider.connectedProvider': '已連接的服務商',
    'provider.connectWallet': '請連接您的 MetaMask 錢包成為服務提供商',
    'provider.walletNotConnected': '錢包未連接',
    'provider.totalServices': '總服務數',
    'provider.activeServices': '活躍服務',
    'provider.totalSubscribers': '總訂閱者',
    'provider.totalRevenue': '總收入',
    'provider.createService': '創建新服務',
    'provider.serviceName': '服務名稱',
    'provider.serviceSymbol': '服務符號',
    'provider.servicePrice': '服務價格',
    'provider.serviceDuration': '服務期限',
    'provider.serviceDescription': '服務描述',
    'provider.descriptionPlaceholder': '描述您的服務...',
    'provider.create': '創建服務',
    'provider.creating': '創建中...',
    'provider.myServices': '我的服務',
    'provider.noServices': '暫無服務',
    'provider.noServicesDescription': '創建您的第一個訂閱服務開始賺錢',
    'provider.symbol': '符號',
    'provider.price': '價格',
    'provider.duration': '期限',
    'provider.days': '天',
    'provider.subscribers': '訂閱者',
    'provider.revenue': '收入',
    'provider.analytics': '分析',
    'provider.settings': '設置',

    // 通用
    'common.loading': '載入中...',
    'common.error': '錯誤',
    'common.success': '成功',
    'common.connectWallet': '請先連接錢包',
    'common.switchNetwork': '請切換到 Morph Holesky 網路',
    'common.close': '關閉',
    'common.confirm': '確認',
    'common.cancel': '取消',
    'common.hours': '小時',
    'common.minutes': '分鐘',
    'common.loadFailed': '載入失敗',

    // 錯誤訊息
    'error.walletNotConnected': '請先連接錢包',
    'error.insufficientBalance': 'USDT 餘額不足',
    'error.transactionFailed': '交易失敗',
    'error.contractCallFailed': '合約調用失敗',
    'error.networkError': '網路錯誤',

    // 成功訊息
    'success.subscriptionPurchased': '訂閱購買成功！',
    'success.nftListed': 'NFT 掛單成功！',
    'success.nftPurchased': 'NFT 購買成功！',
    'success.listingCanceled': '掛單取消成功！',
    'success.serviceCreated': '服務創建成功！',
    'success.tokensClaimed': '測試代幣獲取成功！'
  },

  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.consumer': 'Consumer',
    'nav.provider': 'Provider',
    'nav.history': 'History',
    'nav.subscriptions': 'Subscriptions',
    'nav.transfer': 'Transfer',
    'nav.connectWallet': 'Connect Wallet',
    'nav.disconnect': 'Disconnect Wallet',
    'nav.language': 'Language',

    // Home Page
    'home.title': 'Decentralized Subscription Management Platform',
    'home.subtitle': 'Transform your subscriptions into tradeable digital assets. Buy, own, and transfer subscription NFTs with complete control over your digital content access.',
    'home.forConsumers': 'I\'m a Consumer',
    'home.forProviders': 'I\'m a Provider',
    'home.getStarted': 'Get Started',
    'home.consumers.title': 'Buy and Manage Subscriptions',
    'home.consumers.desc': 'Browse and manage subscription NFTs',
    'home.providers.title': 'Create Subscription Services',
    'home.providers.desc': 'Launch your subscription as NFTs',
    'home.features.title': 'Why Choose NFT Subscriptions?',
    'home.features.description': 'We solve the problems of traditional subscription models by making them transferable, manageable, and valuable.',
    'home.features.nft': 'NFT Subscriptions',
    'home.features.nftDesc': 'Each subscription is a unique NFT that can be transferred and traded',
    'home.features.marketplace': 'Built-in Marketplace',
    'home.features.marketplaceDesc': 'Zero-fee P2P trading marketplace to buy and sell subscriptions anytime',
    'home.features.secure': 'Secure & Transparent',
    'home.features.secureDesc': 'Based on smart contracts, all transactions are transparent and immutable',

    // Consumer Page
    'consumer.title': 'UniSub Consumer',
    'consumer.subtitle': 'Discover, purchase, and manage your decentralized subscription services',
    'consumer.connectWallet': 'Connect Your Wallet',
    'consumer.connectWalletDescription': 'Connect your wallet to start using all UniSub features',
    'consumer.networkMismatch': 'Network Mismatch',
    'consumer.networkMismatchDescription': 'Please switch to the supported test network to use UniSub features',
    'consumer.currentNetwork': 'Current Network',
    'consumer.switchToMorph': 'Switch to Morph Holesky',
    'consumer.walletAddress': 'Wallet Address',
    'consumer.ethBalance': 'ETH Balance',
    'consumer.network': 'Network',
    'consumer.notConnected': 'Not Connected',
    'consumer.tabs.browse': 'Subscription Services',
    'consumer.tabs.market': 'Subscription Marketplace',
    'consumer.tabs.nfts': 'My Subscriptions',
    'consumer.tabs.tokens': 'Test Tokens',
    'consumer.tabs.browseDesc': 'Browse and purchase subscription services',
    'consumer.tabs.marketDesc': 'Buy and sell subscription services',
    'consumer.tabs.nftsDesc': 'Manage your subscription services',
    'consumer.tabs.tokensDesc': 'Get test USDT tokens',

    // Services
    'services.title': 'Available Subscription Services',
    'services.refresh': 'Refresh',
    'services.refreshing': 'Loading...',
    'services.noServices': 'No subscription services available',
    'services.price': 'Price',
    'services.duration': 'Duration',
    'services.days': 'days',
    'services.provider': 'Provider',
    'services.subscribe': 'Subscribe',
    'services.subscribing': 'Subscribing...',
    'services.connectWallet': 'Connect wallet to purchase subscriptions',
    'services.connectWalletDescription': 'Please connect your wallet to browse and purchase subscription services',
    'services.subscriptionServices': 'Subscription Services',
    'services.description': 'Choose and purchase the subscription services you need, each purchase will mint an NFT to your wallet',
    'services.loading': 'Loading subscription services...',
    'services.subscriptionPeriod': 'Subscription period',
    'services.serviceProvider': 'Service provider',
    'services.purchaseSuccess': 'Successfully purchased subscription for',
    'services.usdtBalance': 'Your USDT Balance',
    'services.testContract': 'Test Contract',
    'services.hasActiveSubscription': 'You have an active subscription',
    'services.expirationTime': 'Expiration time',
    'services.insufficientBalance': 'Insufficient USDT balance',
    'services.needAmount': 'Need',
    'services.currentAmount': 'You currently have',
    'services.purchased': '✓ Purchased',
    'services.purchasing': 'Purchasing...',
    'services.insufficientFunds': 'Insufficient funds',
    'services.purchaseFor': 'Purchase for',
    'services.contract': 'Contract Address',
    'services.noServicesAvailable': 'No services available',
    'services.noServicesDescription': 'There are no subscription services available for purchase right now, please check back later',
    'services.reload': 'Reload',

    // Marketplace
    'marketplace.title': 'Subscription Marketplace',
    'marketplace.description': 'Discover and buy subscription services from other users, or sell your own subscriptions',
    'marketplace.balance': 'USDT Balance',
    'marketplace.yourBalance': 'Your USDT Balance',
    'marketplace.refresh': 'Refresh',
    'marketplace.refreshing': 'Refreshing',
    'marketplace.loadingData': 'Loading market data...',
    'marketplace.connectWallet': 'Connect Wallet to Use Market',
    'marketplace.connectWalletDesc': 'Please connect your wallet first to browse and buy subscription services',
    'marketplace.availableNFTs': 'Available Subscriptions',
    'marketplace.expiredListings': 'Expired Listings',
    'marketplace.noListings': 'No Listings Currently',
    'marketplace.noListingsDesc': 'There are no subscription services available for purchase in the market right now, please check back later',
    'marketplace.recheck': 'Check Again',
    'marketplace.buySuccess': 'Purchase Successful!',
    'marketplace.buyFailed': 'Purchase Failed',
    'marketplace.cancelSuccess': 'Listing Cancelled!',
    'marketplace.cancelFailed': 'Cancel Listing Failed',
    'marketplace.seller': 'Seller',
    'marketplace.expires': 'Expires',
    'marketplace.buy': 'Buy',
    'marketplace.buying': 'Buying...',
    'marketplace.cancel': 'Cancel Listing',
    'marketplace.canceling': 'Canceling...',
    'marketplace.expired': 'Expired',

    // My Subscriptions
    'myNFTs.title': 'My Subscription Services',
    'myNFTs.description': 'Manage your owned subscription services, you can sell them to other users',
    'myNFTs.noNFTs': 'You don\'t have any subscription services yet',
    'myNFTs.noNFTsDesc': 'Purchase some subscription services to get your first subscription',
    'myNFTs.connectWallet': 'Connect Wallet to View Your Subscriptions',
    'myNFTs.connectWalletDesc': 'Please connect your wallet first to view your owned subscription services',
    'myNFTs.loadingNFTs': 'Loading your subscriptions...',
    'myNFTs.tokenId': 'Token ID',
    'myNFTs.validUntil': 'Valid Until',
    'myNFTs.expired': 'Expired',
    'myNFTs.active': 'Active',
    'myNFTs.sellPrice': 'Sell Price',
    'myNFTs.sellDuration': 'Listing Duration',
    'myNFTs.listForSale': 'List for Sale',
    'myNFTs.listing': 'Listing...',
    'myNFTs.cancel': 'Cancel',
    'myNFTs.priceRequired': 'Please enter a valid price',
    'myNFTs.listingSuccess': 'Successfully listed for sale!',
    'myNFTs.listingFailed': 'Listing failed',
    'myNFTs.days': 'days',

    // Test Tokens
    'testTokens.title': 'Test Tokens',
    'testTokens.getTestTokens': 'Get Test USDT',
    'testTokens.description': 'Get free test USDT to try subscription features (testnet only)',
    'testTokens.currentBalance': 'Current Balance',
    'testTokens.amount': 'Amount',
    'testTokens.getMockUSDT': 'Get Test USDT',
    'testTokens.getting': 'Getting...',
    'testTokens.processing': 'Processing...',
    'testTokens.checkBalance': 'Check Balance',
    'testTokens.switchToTestnet': 'Please switch to testnet',
    'testTokens.testnetOnly': 'Test token features are only available on Morph Holesky or Sepolia testnet',
    'testTokens.getTokens': 'Get Tokens',
    'testTokens.successMessage': 'Successfully got',
    'testTokens.testUSDT': 'Test USDT',
    'testTokens.note': 'Note',
    'testTokens.noteDescription': 'Test tokens are for testing purposes only and have no real value.',
    'testTokens.usageNote': 'You can use these tokens to test subscription purchases and marketplace trading features.',

    // Provider Page
    'provider.title': 'Provider Hub',
    'provider.description': 'Create and manage your subscription services',
    'provider.manageServices': 'Manage your subscription services',
    'provider.connectedProvider': 'Connected Provider',
    'provider.connectWallet': 'Connect your MetaMask wallet to become a service provider',
    'provider.walletNotConnected': 'Wallet not connected',
    'provider.totalServices': 'Total Services',
    'provider.activeServices': 'Active Services',
    'provider.totalSubscribers': 'Total Subscribers',
    'provider.totalRevenue': 'Total Revenue',
    'provider.createService': 'Create New Service',
    'provider.serviceName': 'Service Name',
    'provider.serviceSymbol': 'Service Symbol',
    'provider.servicePrice': 'Service Price',
    'provider.serviceDuration': 'Service Duration',
    'provider.serviceDescription': 'Description',
    'provider.descriptionPlaceholder': 'Describe your service...',
    'provider.create': 'Create Service',
    'provider.creating': 'Creating...',
    'provider.myServices': 'My Services',
    'provider.noServices': 'No Services',
    'provider.noServicesDescription': 'Create your first subscription service to start earning',
    'provider.symbol': 'Symbol',
    'provider.price': 'Price',
    'provider.duration': 'Duration',
    'provider.days': 'days',
    'provider.subscribers': 'Subscribers',
    'provider.revenue': 'Revenue',
    'provider.analytics': 'Analytics',
    'provider.settings': 'Settings',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.connectWallet': 'Please connect your wallet',
    'common.switchNetwork': 'Please switch to Morph Holesky network',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    'common.cancel': 'Cancel',
    'common.hours': 'hours',
    'common.minutes': 'minutes',
    'common.loadFailed': 'Load failed',

    // Error Messages
    'error.walletNotConnected': 'Please connect your wallet first',
    'error.insufficientBalance': 'Insufficient USDT balance',
    'error.transactionFailed': 'Transaction failed',
    'error.contractCallFailed': 'Contract call failed',
    'error.networkError': 'Network error',

    // Success Messages
    'success.subscriptionPurchased': 'Subscription purchased successfully!',
    'success.nftListed': 'NFT listed successfully!',
    'success.nftPurchased': 'NFT purchased successfully!',
    'success.listingCanceled': 'Listing canceled successfully!',
    'success.serviceCreated': 'Service created successfully!',
    'success.tokensClaimed': 'Test tokens claimed successfully!'
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh');

  useEffect(() => {
    // 從 localStorage 載入保存的語言設定
    const savedLanguage = localStorage.getItem('unisub-language') as Language;
    if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('unisub-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
