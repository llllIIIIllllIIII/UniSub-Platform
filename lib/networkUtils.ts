/**
 * 網路配置和自動切換工具
 * 用於確保用戶預設使用 Morph Holesky 網路
 */

// Morph Holesky 網路配置
export const MORPH_HOLESKY_CONFIG = {
  chainId: '0xafa', // 2810 in hex
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
};

export const MORPH_HOLESKY_CHAIN_ID = 2810;

/**
 * 檢查當前是否為 Morph Holesky 網路
 */
export const isOnMorphHolesky = async (): Promise<boolean> => {
  if (typeof window.ethereum === 'undefined') {
    return false;
  }
  
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const currentChainId = parseInt(chainId, 16);
    return currentChainId === MORPH_HOLESKY_CHAIN_ID;
  } catch (error) {
    console.error('Error checking network:', error);
    return false;
  }
};

/**
 * 自動添加並切換到 Morph Holesky 網路
 */
export const addAndSwitchToMorphHolesky = async (): Promise<boolean> => {
  if (typeof window.ethereum === 'undefined') {
    console.error('MetaMask is not installed');
    return false;
  }

  try {
    // 首先嘗試切換到 Morph Holesky
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: MORPH_HOLESKY_CONFIG.chainId }],
    });
    
    console.log('✅ Successfully switched to Morph Holesky');
    return true;
  } catch (switchError: any) {
    // 如果網路不存在（錯誤代碼 4902），則添加網路
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [MORPH_HOLESKY_CONFIG],
        });
        
        console.log('✅ Successfully added and switched to Morph Holesky');
        return true;
      } catch (addError) {
        console.error('❌ Failed to add Morph Holesky network:', addError);
        return false;
      }
    } else {
      console.error('❌ Failed to switch to Morph Holesky:', switchError);
      return false;
    }
  }
};

/**
 * 在應用啟動時自動檢查網路並提示用戶
 */
export const initializeDefaultNetwork = async (): Promise<void> => {
  if (typeof window.ethereum === 'undefined') {
    console.log('MetaMask not detected, skipping network initialization');
    return;
  }

  try {
    // 檢查是否已經連接錢包
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    
    if (accounts.length > 0) {
      // 如果已經連接，檢查網路
      const isCorrectNetwork = await isOnMorphHolesky();
      
      if (!isCorrectNetwork) {
        console.log('🔄 Current network is not Morph Holesky, prompting user to switch...');
        
        // 可以在這裡顯示一個友好的提示
        const shouldSwitch = confirm(
          'To use UniSub Platform optimally, we recommend switching to Morph Holesky Testnet. Would you like to add/switch to it now?'
        );
        
        if (shouldSwitch) {
          await addAndSwitchToMorphHolesky();
        }
      }
    }
  } catch (error) {
    console.error('Error during network initialization:', error);
  }
};

/**
 * 獲取網路狀態信息
 */
export const getNetworkInfo = async () => {
  if (typeof window.ethereum === 'undefined') {
    return null;
  }

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const currentChainId = parseInt(chainId, 16);
    
    return {
      chainId: currentChainId,
      hexChainId: chainId,
      isMorphHolesky: currentChainId === MORPH_HOLESKY_CHAIN_ID,
      networkName: currentChainId === MORPH_HOLESKY_CHAIN_ID 
        ? 'Morph Holesky Testnet' 
        : 'Unknown Network'
    };
  } catch (error) {
    console.error('Error getting network info:', error);
    return null;
  }
};
