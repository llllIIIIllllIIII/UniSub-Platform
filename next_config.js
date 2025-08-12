/** @type {import('next').NextConfig} */
const nextConfig = {
  // 優化 Web3 相關功能
  webpack: (config) => {
    // 解決一些 Web3 庫的兼容性問題
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "fs": false,
      "net": false,
      "tls": false,
    };
    return config;
  },
  
  // 環境變數配置
  env: {
    // Morph Holesky 作為預設網路
    DEFAULT_CHAIN_ID: '2810',
    DEFAULT_NETWORK_NAME: 'Morph Holesky Testnet',
  }
}

module.exports = nextConfig