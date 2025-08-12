'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './Web3Context';
import { useLanguage } from './LanguageContext';
import { 
  CONTRACT_ADDRESSES, 
  FACTORY_ABI, 
  SUBSCRIPTION_ABI, 
  USDT_ABI,
  formatUSDT,
  parseUSDT,
  getContractConfig,
  createUSDTBalanceError,
  type MarketListing,
  type SubscriptionService,
  type UserSubscriptionStatus 
} from './contracts';

export function useUniSub() {
  const { provider, signer, userAddress, chainId, isConnected } = useWeb3();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 取得合約實例
  const getContracts = () => {
    if (!provider || !chainId) {
      throw new Error('請先連接錢包');
    }

    const config = getContractConfig(chainId, t);
    
    const factoryContract = new ethers.Contract(
      config.contracts.subscriptionFactory,
      FACTORY_ABI,
      signer || provider
    );

    const usdtContract = new ethers.Contract(
      config.contracts.mockUSDT,
      USDT_ABI,
      signer || provider
    );

    return { factoryContract, usdtContract, config };
  };

  // 獲取用戶 USDT 餘額
  const getUSDTBalance = async (address?: string): Promise<string> => {
    try {
      const { usdtContract } = getContracts();
      const targetAddress = address || userAddress;
      if (!targetAddress) throw new Error('請提供地址');

      const balance = await usdtContract.balanceOf(targetAddress);
      return formatUSDT(balance);
    } catch (err: any) {
      console.error('獲取 USDT 餘額失敗:', err);
      throw new Error(createUSDTBalanceError(err.message, t));
    }
  };

  // 測試合約連接
  const testContractConnection = async (): Promise<boolean> => {
    try {
      console.log('🧪 測試合約連接...');
      const { factoryContract, config } = getContracts();
      
      console.log('� 合約地址:', config.contracts.subscriptionFactory);
      console.log('🌐 當前網路:', chainId);
      console.log('🔗 RPC URL:', config.rpcUrl);
      
      // 檢查合約代碼
      const code = await provider!.getCode(config.contracts.subscriptionFactory);
      console.log('📄 合約代碼長度:', code.length);
      
      if (code === '0x') {
        console.error('❌ 合約未部署');
        return false;
      }
      
      console.log('✅ 合約已部署');
      
      // 嘗試調用一個簡單的 view 函數
      try {
        const result = await factoryContract.getAllCollections();
        console.log('✅ 合約調用成功，集合數量:', result.length);
        return true;
      } catch (callError: any) {
        console.error('❌ 合約調用失敗:', callError);
        console.error('錯誤代碼:', callError.code);
        console.error('錯誤消息:', callError.message);
        
        // 檢查是否是網路問題
        if (callError.code === 'CALL_EXCEPTION') {
          console.error('這可能是 ABI 不匹配或函數不存在的問題');
        }
        
        return false;
      }
    } catch (error: any) {
      console.error('💥 測試連接失敗:', error);
      return false;
    }
  };

  // 獲取所有訂閱服務
  const getAllSubscriptionServices = async (): Promise<SubscriptionService[]> => {
    try {
      setLoading(true);
      const { factoryContract, config } = getContracts();
      
      console.log('🔍 正在獲取訂閱服務...');
      console.log('工廠合約地址:', config.contracts.subscriptionFactory);
      console.log('當前網路 Chain ID:', chainId);
      
      // 首先測試合約連接
      const isConnected = await testContractConnection();
      if (!isConnected) {
        throw new Error('無法連接到合約，請檢查網路配置');
      }
      
      // 調用合約獲取所有訂閱集合地址，加入錯誤處理
      let collectionAddresses: string[] = [];
      try {
        collectionAddresses = await factoryContract.getAllCollections();
        console.log('📋 找到訂閱集合:', collectionAddresses);
      } catch (factoryError: any) {
        console.warn('⚠️ 無法從 Factory 獲取集合，嘗試使用預設服務:', factoryError.message);
        
        // 如果 getAllCollections 失敗，使用預設的服務地址
        const config = getContractConfig(chainId, t);
        const defaultServices = Object.values(config.services || {}) as string[];
        
        if (defaultServices.length > 0) {
          console.log('🔄 使用預設服務地址:', defaultServices);
          collectionAddresses = defaultServices;
        } else {
          console.log('❌ 沒有可用的服務地址');
          throw new Error('無法獲取訂閱服務列表，且沒有預設服務可用');
        }
      }
      
      if (collectionAddresses.length === 0) {
        console.log('⚠️ 沒有找到任何訂閱服務');
        return [];
      }
      
      const services: SubscriptionService[] = [];

      for (const address of collectionAddresses) {
        try {
          console.log('🔍 處理訂閱合約:', address);
          
          const subscriptionContract = new ethers.Contract(address, SUBSCRIPTION_ABI, provider);
          
          // 使用 Factory 合約獲取完整資訊，包括創建者地址
          const [collectionInfo, contractInfo] = await Promise.all([
            factoryContract.getCollectionInfo(address), // 獲取 (name, symbol, owner, price, duration, createdAt, isActive)
            subscriptionContract.getContractInfo() // 獲取 (serviceName, price, duration, totalSupply)
          ]);

          // 解構 collectionInfo - 包含創建者地址
          const [name, symbol, ownerAddress, collectionPrice, collectionDuration, createdAt, isActive] = collectionInfo;
          
          // 解構 contractInfo
          const [serviceName, priceWei, duration, totalSupply] = contractInfo;

          services.push({
            address,
            name: serviceName, // 使用 contractInfo 中的 serviceName
            symbol,
            price: formatUSDT(priceWei),
            priceWei,
            duration: duration.toNumber(),
            serviceProvider: ownerAddress // 使用創建者的錢包地址
          });
          
          console.log('✅ 成功處理服務:', serviceName, '創建者:', ownerAddress);
        } catch (err: any) {
          console.error('❌ 處理訂閱合約失敗:', address, err);
          // 繼續處理其他合約，不中斷整個流程
        }
      }

      console.log('🎉 總共找到', services.length, '個訂閱服務');
      return services;
    } catch (err: any) {
      console.error('💥 獲取訂閱服務失敗:', err);
      console.error('錯誤詳情:', {
        message: err.message,
        code: err.code,
        data: err.data,
        transaction: err.transaction
      });
      setError(`獲取訂閱服務失敗: ${err.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // 購買訂閱
  const purchaseSubscription = async (subscriptionAddress: string): Promise<string> => {
    try {
      if (!signer || !userAddress) throw new Error('請先連接錢包');
      
      setLoading(true);
      setError('');

      const { usdtContract } = getContracts();
      const subscriptionContract = new ethers.Contract(subscriptionAddress, SUBSCRIPTION_ABI, signer);

      // 獲取價格
      const price = await subscriptionContract.price(); // 改為 price()

      // 檢查餘額
      const balance = await usdtContract.balanceOf(userAddress);
      if (balance.lt(price)) {
        throw new Error(`USDT 餘額不足。需要 ${formatUSDT(price)} USDT`);
      }

      // 檢查是否已有有效訂閱
      const hasValid = await subscriptionContract.hasValidSubscription(userAddress);
      if (hasValid) {
        throw new Error('您已經擁有有效的訂閱');
      }

      // 授權支付
      console.log('授權 USDT 支付...');
      const approveTx = await usdtContract.approve(subscriptionAddress, price);
      await approveTx.wait();

      // 購買訂閱
      console.log('購買訂閱 NFT...');
      const mintTx = await subscriptionContract.mintSubscription();
      const receipt = await mintTx.wait();

      console.log('訂閱購買成功！', receipt.transactionHash);
      return receipt.transactionHash;

    } catch (err: any) {
      console.error('購買訂閱失敗:', err);
      const errorMsg = err.message || '購買失敗';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 檢查用戶訂閱狀態
  const checkSubscriptionStatus = async (subscriptionAddress: string): Promise<UserSubscriptionStatus> => {
    try {
      if (!userAddress) throw new Error('請先連接錢包');

      const subscriptionContract = new ethers.Contract(subscriptionAddress, SUBSCRIPTION_ABI, provider);
      
      const [hasValid, userTokens, serviceName] = await Promise.all([
        subscriptionContract.hasValidSubscription(userAddress),
        subscriptionContract.getUserTokens(userAddress),
        subscriptionContract.name()
      ]);

      if (hasValid && userTokens.length > 0) {
        const expiration = await subscriptionContract.getExpiryTime(userTokens[0]);
        return {
          hasActiveSubscription: true,
          tokenId: userTokens[0].toString(),
          expirationTime: new Date(expiration.toNumber() * 1000),
          serviceName,
          serviceAddress: subscriptionAddress
        };
      }

      return { hasActiveSubscription: false };
    } catch (err: any) {
      console.error('檢查訂閱狀態失敗:', err);
      return { hasActiveSubscription: false };
    }
  };

  // 獲取市場掛單
  const getMarketListings = async (): Promise<MarketListing[]> => {
    try {
      setLoading(true);
      const { factoryContract } = getContracts();
      
      const listings = await factoryContract.getMarketListings();
      const formattedListings: MarketListing[] = [];

      for (const listing of listings) {
        try {
          // 新格式：(bytes32 listingId, address seller, address collection, uint256 tokenId, uint256 price, uint256 expiryTime, bool isActive, uint256 listedAt)
          const subscriptionContract = new ethers.Contract(
            listing.collection, // 使用 collection 而不是 subscriptionContract
            SUBSCRIPTION_ABI, 
            provider
          );
          
          const [serviceName, symbol] = await Promise.all([
            subscriptionContract.name(),
            subscriptionContract.symbol()
          ]);

          formattedListings.push({
            listingId: listing.listingId, // 新增 listingId
            subscriptionContract: listing.collection, // 使用 collection
            tokenId: listing.tokenId.toString(),
            price: formatUSDT(listing.price),
            priceWei: listing.price,
            seller: listing.seller,
            expirationTime: new Date(listing.expiryTime.toNumber() * 1000), // 使用 expiryTime
            serviceName,
            serviceSymbol: symbol,
            isActive: listing.isActive // 新增 isActive 狀態
          });
        } catch (err) {
          console.error('處理掛單失敗:', err);
          // 跳過這個掛單，繼續處理其他的
        }
      }

      return formattedListings.filter(listing => listing.isActive); // 只返回活躍的掛單
    } catch (err: any) {
      console.error('獲取市場掛單失敗:', err);
      setError(`獲取市場掛單失敗: ${err.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // 在市場出售 NFT
  const listNFTForSale = async (
    subscriptionAddress: string, 
    tokenId: string, 
    priceInUSDT: string,
    durationInDays: number = 7
  ): Promise<string> => {
    try {
      if (!signer || !userAddress) throw new Error('請先連接錢包');
      
      setLoading(true);
      setError('');

      const { factoryContract, config } = getContracts();
      const subscriptionContract = new ethers.Contract(subscriptionAddress, SUBSCRIPTION_ABI, signer);
      const price = parseUSDT(priceInUSDT);
      const duration = durationInDays * 24 * 60 * 60; // 轉換為秒

      // 檢查是否擁有該 NFT
      const owner = await subscriptionContract.ownerOf(tokenId);
      if (owner.toLowerCase() !== userAddress.toLowerCase()) {
        throw new Error('您不是該 NFT 的擁有者');
      }

      // 授權工廠合約轉移 NFT
      console.log('授權 NFT 轉移...');
      const approveTx = await subscriptionContract.approve(config.contracts.subscriptionFactory, tokenId);
      await approveTx.wait();

      // 掛單出售 - 修正參數數量：只需要3個參數
      console.log('掛單出售...');
      const listTx = await factoryContract.listSubscription(subscriptionAddress, tokenId, price);
      const receipt = await listTx.wait();

      console.log('NFT 掛單成功！', receipt.transactionHash);
      return receipt.transactionHash;

    } catch (err: any) {
      console.error('掛單失敗:', err);
      const errorMsg = err.message || '掛單失敗';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 從市場購買 NFT
  // 從市場購買 NFT - 使用 listingId
  const buyNFTFromMarket = async (
    listingId: string
  ): Promise<string> => {
    try {
      if (!signer || !userAddress) throw new Error('請先連接錢包');
      
      setLoading(true);
      setError('');

      const { factoryContract, usdtContract, config } = getContracts();
      
      // 找到對應的掛單
      const listings = await factoryContract.getMarketListings();
      const listing = listings.find((l: any) => 
        l.listingId === listingId && l.isActive
      );

      if (!listing) {
        throw new Error('找不到對應的掛單或掛單已失效');
      }

      // 檢查餘額
      const balance = await usdtContract.balanceOf(userAddress);
      if (balance.lt(listing.price)) {
        throw new Error(`USDT 餘額不足。需要 ${formatUSDT(listing.price)} USDT`);
      }

      // 授權支付
      console.log('授權 USDT 支付...');
      const approveTx = await usdtContract.approve(config.contracts.subscriptionFactory, listing.price);
      await approveTx.wait();

      // 購買 - 使用 listingId
      console.log('從市場購買 NFT...');
      const buyTx = await factoryContract.buySubscription(listingId);
      const receipt = await buyTx.wait();

      console.log('市場購買成功！', receipt.transactionHash);
      return receipt.transactionHash;

    } catch (err: any) {
      console.error('市場購買失敗:', err);
      const errorMsg = err.message || '購買失敗';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 取消掛單 - 使用 listingId
  const cancelListing = async (
    listingId: string
  ): Promise<string> => {
    try {
      if (!signer || !userAddress) throw new Error('請先連接錢包');
      
      setLoading(true);
      setError('');

      const { factoryContract } = getContracts();

      // 取消掛單
      console.log('取消掛單...', listingId);
      const cancelTx = await factoryContract.cancelListing(listingId);
      const receipt = await cancelTx.wait();

      console.log('掛單取消成功！', receipt.transactionHash);
      return receipt.transactionHash;

    } catch (err: any) {
      console.error('取消掛單失敗:', err);
      const errorMsg = err.message || '取消掛單失敗';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 獲取用戶擁有的所有訂閱 NFT
  const getUserSubscriptions = async (): Promise<{
    subscriptionContract: string;
    tokenIds: string[];
    serviceName: string;
  }[]> => {
    try {
      if (!userAddress) throw new Error('請先連接錢包');

      const { factoryContract } = getContracts();
      
      // 獲取所有活躍的訂閱集合
      const allCollections = await factoryContract.getAllCollections();
      const result = [];

      for (const address of allCollections) {
        try {
          const subscriptionContract = new ethers.Contract(address, SUBSCRIPTION_ABI, provider);
          
          // 獲取用戶在此合約中擁有的代幣
          const userTokens = await subscriptionContract.getUserTokens(userAddress);
          
          if (userTokens.length > 0) {
            const serviceName = await subscriptionContract.name();
            
            result.push({
              subscriptionContract: address,
              tokenIds: userTokens.map((id: any) => id.toString()),
              serviceName
            });
          }
        } catch (err: any) {
          console.error('處理訂閱合約失敗:', address, err);
          // 繼續處理其他合約
        }
      }

      return result;
    } catch (err: any) {
      console.error('獲取用戶訂閱失敗:', err);
      return [];
    }
  };

  // 獲取測試 USDT (僅限測試網)
  const getMockUSDT = async (amount: string = "1000"): Promise<string> => {
    try {
      if (!signer || !userAddress) throw new Error('請先連接錢包');
      
      setLoading(true);
      setError('');

      const { usdtContract } = getContracts();
      
      try {
        // 使用 faucet 函數而不是 mint，這是公共函數，任何用戶都可以調用
        console.log('調用 faucet 函數獲取測試 USDT...');
        const tx = await usdtContract.faucet(userAddress);
        const receipt = await tx.wait();
        
        console.log('✅ 成功獲得測試 USDT');
        console.log('交易哈希:', receipt.transactionHash);
        
        return receipt.transactionHash;
        
      } catch (faucetError: any) {
        console.error('Faucet 操作失敗:', faucetError);
        
        // 如果是 gas 估算錯誤，提供更友好的錯誤信息
        if (faucetError.code === 'UNPREDICTABLE_GAS_LIMIT') {
          throw new Error('無法獲取測試代幣。可能的原因：已經領取過代幣或達到領取限制。');
        }
        
        // 如果是已領取錯誤
        if (faucetError.message?.includes('already claimed') || 
            faucetError.message?.includes('AlreadyClaimed')) {
          throw new Error('此地址已經領取過測試代幣。請使用其他地址或等待重置。');
        }
        
        throw faucetError;
      }

    } catch (err: any) {
      console.error('獲取測試 USDT 失敗:', err);
      const errorMsg = err.message || '獲取測試代幣失敗';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    // 基礎功能
    getUSDTBalance,
    getAllSubscriptionServices,
    purchaseSubscription,
    checkSubscriptionStatus,
    // 市場功能
    getMarketListings,
    listNFTForSale,
    buyNFTFromMarket,
    cancelListing,
    // 用戶管理
    getUserSubscriptions,
    // 測試功能
    getMockUSDT,
    testContractConnection
  };
}
