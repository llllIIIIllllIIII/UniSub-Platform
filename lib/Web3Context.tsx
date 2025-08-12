'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { initializeDefaultNetwork } from './networkUtils';

// 添加 window.ethereum 的類型聲明
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface Web3ContextType {
  isConnected: boolean;
  userAddress: string;
  ethBalance: string;
  chainId: number | null;
  networkName: string;
  isCorrectNetwork: boolean;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToNetwork: (networkId: number) => Promise<void>;
  switchToSepolia: () => Promise<void>;
  switchToMorphHolesky: () => Promise<void>;
  isLoading: boolean;
  error: string;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// 支援的網路配置
const NETWORKS = {
  sepolia: {
    chainId: 11155111,
    hexChainId: '0xaa36a7',
    name: 'Sepolia Testnet',
    config: {
      chainId: '0xaa36a7',
      chainName: 'Sepolia Test Network',
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: ['https://sepolia.infura.io/v3/'],
      blockExplorerUrls: ['https://sepolia.etherscan.io/'],
    }
  },
  morphHolesky: {
    chainId: 2810,
    hexChainId: '0xafa',
    name: 'Morph Holesky Testnet',
    config: {
      chainId: '0xafa',
      chainName: 'Morph Holesky Testnet',
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: [
        'https://rpc-quicknode-holesky.morphl2.io',
        'https://rpc-holesky.morphl2.io'
      ],
      blockExplorerUrls: ['https://explorer-holesky.morphl2.io'],
    }
  }
};

// 預設支援的鏈 ID (可以根據合約部署情況調整)
const SUPPORTED_CHAIN_IDS = [NETWORKS.sepolia.chainId, NETWORKS.morphHolesky.chainId];

// 向後兼容的常數
const SEPOLIA_CHAIN_ID = NETWORKS.sepolia.chainId;
const SEPOLIA_CONFIG = NETWORKS.sepolia.config;

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [ethBalance, setEthBalance] = useState('0');
  const [chainId, setChainId] = useState<number | null>(null);
  const [networkName, setNetworkName] = useState<string>('');
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 獲取網路名稱
  const getNetworkName = (chainId: number | null): string => {
    if (!chainId) return 'Unknown Network';
    
    switch (chainId) {
      case NETWORKS.sepolia.chainId:
        return NETWORKS.sepolia.name;
      case NETWORKS.morphHolesky.chainId:
        return NETWORKS.morphHolesky.name;
      default:
        return 'Unsupported Network';
    }
  };

  const isCorrectNetwork = SUPPORTED_CHAIN_IDS.includes(chainId || 0);

  // 檢查是否已連接錢包
  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        console.log('🔍 檢查現有錢包連接...');
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        console.log('💳 現有帳戶:', accounts);
        if (accounts.length > 0) {
          await initializeWeb3(accounts[0]);
        } else {
          console.log('❌ 未找到已連接的帳戶');
        }
      } catch (error) {
        console.error('💥 檢查錢包連接失敗:', error);
      }
    } else {
      console.log('❌ 未檢測到 window.ethereum');
    }
  };

  // 初始化 Web3
  const initializeWeb3 = async (address: string) => {
    try {
      console.log('🚀 開始初始化 Web3，地址:', address);
      
      // 檢查 window.ethereum 是否可用
      if (!window.ethereum) {
        throw new Error('MetaMask 未安裝或未啟用');
      }

      console.log('🌐 創建 Web3Provider...');
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      
      console.log('✍️ 獲取 Signer...');
      const web3Signer = web3Provider.getSigner();
      
      console.log('🔗 獲取網路信息...');
      const network = await web3Provider.getNetwork();
      console.log('📡 網路信息:', network);
      
      console.log('💰 獲取餘額...');
      const balance = await web3Provider.getBalance(address);
      console.log('💰 原始餘額:', balance.toString());
      
      const formattedBalance = ethers.utils.formatEther(balance);
      console.log('💰 格式化餘額:', formattedBalance);

      console.log('✅ 設置狀態...');
      setProvider(web3Provider);
      setSigner(web3Signer);
      setUserAddress(address);
      setChainId(network.chainId);
      setNetworkName(getNetworkName(network.chainId));
      setEthBalance(formattedBalance);
      setIsConnected(true);
      
      console.log('🎉 Web3 初始化成功!');
    } catch (error) {
      console.error('💥 初始化 Web3 失敗:', error);
      console.error('錯誤詳情:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error
      });
      setError(`初始化 Web3 失敗: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsConnected(false);
    }
  };

  // 連接錢包
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      const errorMsg = '請安裝 MetaMask 錢包';
      console.error('❌', errorMsg);
      setError(errorMsg);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('🔗 請求連接錢包...');
      
      // 請求連接錢包
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      console.log('👥 獲得帳戶:', accounts);

      if (accounts.length > 0) {
        console.log('✅ 開始初始化 Web3...');
        await initializeWeb3(accounts[0]);
        
        console.log('🔍 檢查網路...');
        // 如果不是正確的網路，提示切換到 Morph Holesky
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
        const currentChainIdNum = parseInt(currentChainId, 16);
        console.log('🌐 當前鏈 ID:', currentChainIdNum, '期望:', NETWORKS.morphHolesky.chainId);
        
        if (currentChainIdNum !== NETWORKS.morphHolesky.chainId) {
          console.log('⚠️ 網路不正確，嘗試切換到 Morph Holesky...');
          await switchToMorphHolesky();
        }
      } else {
        throw new Error('未獲取到任何帳戶');
      }
    } catch (error: any) {
      console.error('💥 連接錢包失敗:', error);
      console.error('錯誤詳情:', {
        code: error.code,
        message: error.message,
        error
      });
      
      if (error.code === 4001) {
        setError('用戶拒絕連接錢包');
      } else if (error.code === -32002) {
        setError('MetaMask 已經在處理連接請求，請檢查 MetaMask 彈窗');
      } else {
        setError(`連接錢包失敗: ${error.message || '未知錯誤'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 斷開錢包連接
  const disconnectWallet = () => {
    setIsConnected(false);
    setUserAddress('');
    setEthBalance('0');
    setChainId(null);
    setNetworkName('');
    setProvider(null);
    setSigner(null);
    setError('');
  };

  // 切換到 Sepolia 網路
  const switchToSepolia = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('請安裝 MetaMask 錢包');
      return;
    }

    try {
      // 嘗試切換到 Sepolia
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CONFIG.chainId }],
      });
    } catch (switchError: any) {
      // 如果網路不存在，嘗試添加
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SEPOLIA_CONFIG],
          });
        } catch (addError) {
          console.error('添加 Sepolia 網路失敗:', addError);
          setError('添加 Sepolia 網路失敗');
        }
      } else {
        console.error('切換網路失敗:', switchError);
        setError('切換到 Sepolia 網路失敗');
      }
    }
  };

  const switchToMorphHolesky = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('請安裝 MetaMask 錢包');
      return;
    }

    try {
      // 嘗試切換到 Morph Holesky
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORKS.morphHolesky.config.chainId }],
      });
    } catch (switchError: any) {
      // 如果網路不存在，嘗試添加
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [NETWORKS.morphHolesky.config],
          });
        } catch (addError) {
          console.error('添加 Morph Holesky 網路失敗:', addError);
          setError('添加 Morph Holesky 網路失敗');
        }
      } else {
        console.error('切換網路失敗:', switchError);
        setError('切換到 Morph Holesky 網路失敗');
      }
    }
  };

  const switchToNetwork = async (networkId: number) => {
    if (typeof window.ethereum === 'undefined') {
      setError('請安裝 MetaMask 錢包');
      return;
    }

    // 根據 networkId 找到對應的網路配置
    let networkConfig;
    if (networkId === NETWORKS.sepolia.chainId) {
      networkConfig = NETWORKS.sepolia.config;
    } else if (networkId === NETWORKS.morphHolesky.chainId) {
      networkConfig = NETWORKS.morphHolesky.config;
    } else {
      setError('不支援的網路');
      return;
    }
    
    try {
      // 嘗試切換到指定網路
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networkConfig.chainId }],
      });
    } catch (switchError: any) {
      // 如果網路不存在，嘗試添加
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkConfig],
          });
        } catch (addError) {
          console.error(`添加 ${networkConfig.chainName} 網路失敗:`, addError);
          setError(`添加 ${networkConfig.chainName} 網路失敗`);
        }
      } else {
        console.error('切換網路失敗:', switchError);
        setError(`切換到 ${networkConfig.chainName} 網路失敗`);
      }
    }
  };

  // 監聽帳戶變化
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== userAddress) {
          initializeWeb3(accounts[0]);
        }
      };

      const handleChainChanged = (chainId: string) => {
        const newChainId = parseInt(chainId, 16);
        setChainId(newChainId);
        setNetworkName(getNetworkName(newChainId));
        
        // 如果連接了錢包但網路不正確，更新餘額
        if (isConnected && userAddress) {
          initializeWeb3(userAddress);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [userAddress, isConnected]);

  // 頁面載入時檢查錢包連接和網路
  useEffect(() => {
    console.log('🚀 Web3Provider 初始化中...');
    
    // 添加一個小延遲以確保頁面完全載入
    const timer = setTimeout(async () => {
      try {
        // 首先初始化默認網路
        await initializeDefaultNetwork();
        
        // 然後檢查錢包連接
        await checkWalletConnection();
      } catch (error) {
        console.error('💥 初始錢包檢查失敗:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // 定期更新餘額
  useEffect(() => {
    if (isConnected && provider && userAddress) {
      const updateBalance = async () => {
        try {
          const balance = await provider.getBalance(userAddress);
          setEthBalance(ethers.utils.formatEther(balance));
        } catch (error) {
          console.error('更新餘額失敗:', error);
        }
      };

      // 立即更新一次
      updateBalance();

      // 每30秒更新一次餘額
      const interval = setInterval(updateBalance, 30000);
      return () => clearInterval(interval);
    }
  }, [isConnected, provider, userAddress]);

  // 更新網路名稱
  useEffect(() => {
    setNetworkName(getNetworkName(chainId));
  }, [chainId]);

  const value: Web3ContextType = {
    isConnected,
    userAddress,
    ethBalance,
    chainId,
    networkName,
    isCorrectNetwork,
    provider,
    signer,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
    switchToNetwork,
    switchToMorphHolesky,
    isLoading,
    error,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}
