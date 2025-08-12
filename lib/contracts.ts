// UniSub 智能合約配置和 ABI 定義
import { ethers } from 'ethers';

// 合約地址配置 - 從 CONTRACT_CONFIG_FOR_FRONTEND.json 同步
export const CONTRACT_ADDRESSES = {
  morphHolesky: {
    chainId: 2810,
    rpcUrl: "https://rpc-quicknode-holesky.morphl2.io",
    // 備用 RPC 節點列表
    rpcUrls: [
      "https://rpc-quicknode-holesky.morphl2.io",
      "https://rpc-holesky.morphl2.io"
    ],
    explorer: "https://explorer-holesky.morphl2.io",
    contracts: {
      mockUSDT: "0xA2c5e6a98dc69CD3e7c94d3694B7D31DB5FFE33F",
      subscriptionFactory: "0x657296a72483F8F330287B2F1E20293a2a2C2F52"
    },
    services: {
      netflixPremium: "0x2FCc622C00bBD6961e08C974167a233cd9FFC283",
      spotifyPremium: "0x1c9fFB664d59F60d157e5885C2EdFB287B913091"
    }
  },
  sepolia: {
    chainId: 11155111,
    rpcUrl: "https://sepolia.infura.io/v3/",
    explorer: "https://sepolia.etherscan.io",
    contracts: {
      mockUSDT: "", // 使用舊合約 - 尚未更新
      subscriptionFactory: "" // 使用舊合約 - 尚未更新
    },
    services: {}
  }
};

// 工廠合約 ABI - 根據最新配置更新
export const FACTORY_ABI = [
  "function createSubscriptionCollection(string memory _name, string memory _symbol, uint256 _price, uint256 _duration) external returns (address)",
  "function getAllCollections() external view returns (address[])",
  "function getCollectionsByOwner(address owner) external view returns (address[])",
  "function getActiveCollections() external view returns (address[])",
  "function getCollectionInfo(address collection) external view returns (tuple(string name, string symbol, address owner, uint256 price, uint256 duration, uint256 createdAt, bool isActive))",
  "function listSubscription(address _collection, uint256 _tokenId, uint256 _price) external returns (bytes32)",
  "function buySubscription(bytes32 listingId) external",
  "function cancelListing(bytes32 listingId) external",
  "function getMarketListings() external view returns (tuple(bytes32 listingId, address seller, address collection, uint256 tokenId, uint256 price, uint256 expiryTime, bool isActive, uint256 listedAt)[])",
  "event CollectionCreated(address indexed creator, address indexed collection, string name, string symbol, uint256 price, uint256 duration)",
  "event NFTListed(bytes32 indexed listingId, address indexed seller, address indexed collection, uint256 tokenId, uint256 price, uint256 expiryTime)",
  "event NFTSold(bytes32 indexed listingId, address indexed buyer, address indexed seller, uint256 price)",
  "event ListingCancelled(bytes32 indexed listingId, address indexed seller)"
];

// 訂閱 NFT 合約 ABI - 根據最新配置更新
export const SUBSCRIPTION_ABI = [
  "function mintSubscription() external returns (uint256)",
  "function renewSubscription(uint256 _tokenId) external",
  "function hasValidSubscription(address _user) external view returns (bool)",
  "function getExpiryTime(uint256 _tokenId) external view returns (uint256)",
  "function getUserTokens(address _user) external view returns (uint256[])",
  "function price() external view returns (uint256)",
  "function duration() external view returns (uint256)",
  "function usdtToken() external view returns (address)", // 新增
  "function getContractInfo() external view returns (string memory serviceName, uint256 subscriptionPrice, uint256 subscriptionDuration, uint256 totalSupply)", // 新增
  "function isExpired(uint256 tokenId) external view returns (bool)",
  "function name() external view returns (string memory)",
  "function symbol() external view returns (string memory)",
  "function tokenURI(uint256 _tokenId) external view returns (string memory)",
  "function ownerOf(uint256 _tokenId) external view returns (address)",
  "function approve(address _to, uint256 _tokenId) external",
  "function getApproved(uint256 _tokenId) external view returns (address)",
  "function setApprovalForAll(address _operator, bool _approved) external",
  "function isApprovedForAll(address _owner, address _operator) external view returns (bool)", // 添加 isApprovedForAll 函數
  "function transferFrom(address _from, address _to, uint256 _tokenId) external",
  "function balanceOf(address _owner) external view returns (uint256)",
  "event SubscriptionMinted(address indexed user, uint256 indexed tokenId, uint256 expirationTime)",
  "event SubscriptionRenewed(uint256 indexed tokenId, uint256 newExpirationTime)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)"
];

// USDT 合約 ABI - 更新後的版本
export const USDT_ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
  "function mint(address to, uint256 amount) external",
  "function decimals() external view returns (uint8)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

// 市場掛單接口
export interface MarketListing {
  listingId: string; // 新增 listingId
  subscriptionContract: string;
  tokenId: string;
  price: string; // 格式化後的 USDT 價格
  seller: string;
  expirationTime: Date;
  serviceName: string;
  serviceSymbol?: string;
  priceWei: ethers.BigNumber; // 原始 wei 格式價格
  isActive: boolean; // 掛單狀態
}

// 訂閱服務接口
export interface SubscriptionService {
  address: string;
  name: string;
  symbol: string;
  price: string; // 格式化後的 USDT 價格
  priceWei: ethers.BigNumber;
  duration: number; // 秒數
  serviceProvider: string;
}

// 用戶訂閱狀態接口
export interface UserSubscriptionStatus {
  hasActiveSubscription: boolean;
  tokenId?: string;
  expirationTime?: Date;
  serviceName?: string;
  serviceAddress?: string;
}

// 輔助函數：格式化 USDT 金額
export function formatUSDT(amount: ethers.BigNumber | string): string {
  return ethers.utils.formatUnits(amount, 6);
}

// 輔助函數：解析 USDT 金額
export function parseUSDT(amount: string): ethers.BigNumber {
  return ethers.utils.parseUnits(amount, 6);
}

// 輔助函數：格式化時間持續
export function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / (24 * 60 * 60));
  if (days > 0) {
    return `${days} 天`;
  }
  const hours = Math.floor(seconds / (60 * 60));
  if (hours > 0) {
    return `${hours} 小時`;
  }
  const minutes = Math.floor(seconds / 60);
   return `${minutes} 分鐘`;
}

// 輔助函數：檢查交易是否過期
export function isSubscriptionExpired(expirationTime: Date): boolean {
  return new Date() > expirationTime;
}

// 取得當前網路的合約配置
export function getContractConfig(chainId: number) {
  let config;
  
  switch (chainId) {
    case 2810:
      config = CONTRACT_ADDRESSES.morphHolesky;
      break;
    case 11155111:
      config = CONTRACT_ADDRESSES.sepolia;
      break;
    default:
      throw new Error(`不支援的網路 chainId: ${chainId}。支援的網路: Morph Holesky (2810), Sepolia (11155111)`);
  }
  
  // 對於 Sepolia，由於還在使用舊合約，允許空地址
  if (chainId === 11155111) {
    console.log(`⚠️ Sepolia 網路使用舊合約配置，某些功能可能不可用`);
    if (!config.contracts.subscriptionFactory && !config.contracts.mockUSDT) {
      throw new Error(`Sepolia 網路的合約地址尚未配置，請使用 Morph Holesky 網路`);
    }
  } else {
    // 對於 Morph Holesky，驗證必要的合約地址是否已配置
    if (!config.contracts.subscriptionFactory) {
      throw new Error(`Chain ID ${chainId} 的 Factory 合約地址未配置`);
    }
    
    if (!config.contracts.mockUSDT) {
      throw new Error(`Chain ID ${chainId} 的 USDT 合約地址未配置`);
    }
  }
  
  console.log(`✅ 使用網路配置 - Chain ID: ${chainId}, Factory: ${config.contracts.subscriptionFactory || 'N/A'}`);
  return config;
}
