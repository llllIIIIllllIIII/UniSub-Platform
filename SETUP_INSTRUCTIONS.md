# 🚀 UniSub 專案安裝指南

## 📋 專案概述

UniSub 是一個基於區塊鏈的 NFT 訂閱平台，使用 Next.js 14 + TypeScript + Tailwind CSS 開發。

## 🛠️ 系統需求

- **Node.js**: 18.x 或更高版本
- **npm**: 8.x 或更高版本
- **瀏覽器**: Chrome, Firefox, Safari (需要 MetaMask 擴展)
- **MetaMask**: 最新版本

## 📦 安裝步驟

### 1. 解壓專案檔案
```bash
# 解壓到您想要的目錄
unzip unisub-project.zip
cd unisub-project
```

### 2. 安裝依賴
```bash
npm install
```

### 3. 啟動開發服務器
```bash
npm run dev
```

### 4. 訪問應用
打開瀏覽器訪問: http://localhost:3000

## 🔗 智能合約地址 (Sepolia 測試網)

```
Mock USDT: 0x51E4026e3ea3E57C57F27a46D1568916e915350f
Subscription Factory: 0xdCb1A78DdC236b34606fC316c715e509Db5EBDcf

預設服務:
- Netflix Premium: 0x1D62ecD70C4B7091A9f809e2d05db6075BDF6eee (15 USDT/月)
- Spotify Premium: 0x63cD8d64757DE5f52Fb87d7727d2b4DFCe9B5d05 (10 USDT/月)  
- YouTube Premium: 0xdAAB147E490274524292255eD021c15563eb006C (12 USDT/月)
```

## 🧪 測試步驟

### 1. 基本功能測試
- 訪問主頁面: http://localhost:3000
- 點擊 "I'm a Consumer" 或 "I'm a Provider"
- 測試錢包連接功能

### 2. Ethers.js 測試
- 訪問: http://localhost:3000/test-ethers
- 點擊 "Run Ethers.js Tests"
- 檢查測試結果

### 3. 完整功能測試
1. **連接 MetaMask**
   - 確保 MetaMask 已安裝並解鎖
   - 切換到 Sepolia 測試網
   - 點擊 "Connect Wallet"

2. **Consumer 功能**
   - 瀏覽可用服務
   - 領取測試 USDT
   - 購買訂閱
   - 管理訂閱

3. **Provider 功能**
   - 創建新服務
   - 查看服務統計
   - 管理服務

## 📁 專案結構

```
unisub-project/
├── app/                    # Next.js App Router 頁面
│   ├── page.tsx           # 主頁面
│   ├── consumer/          # Consumer 頁面
│   │   └── page.tsx
│   ├── provider/          # Provider 頁面
│   │   └── page.tsx
│   ├── test-ethers/       # Ethers.js 測試頁面
│   │   └── page.tsx
│   └── globals.css        # 全局樣式
├── components/            # React 組件
│   ├── Navbar.tsx        # 導航欄
│   ├── footer.tsx        # 頁腳
│   ├── buttons.tsx       # 按鈕組件
│   ├── LoadingSpinner.tsx # 加載組件
│   └── ThemeToggle.tsx   # 主題切換
├── lib/                  # 工具函數
├── package.json          # 依賴配置
├── tailwind.config.js    # Tailwind 配置
├── tsconfig.json         # TypeScript 配置
└── README.md            # 專案說明
```

## 🔧 技術棧

- **前端框架**: Next.js 14
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **區塊鏈**: Ethereum (Sepolia 測試網)
- **Web3**: ethers.js v5.7.2
- **UI 組件**: Lucide React Icons

## 🚨 常見問題

### 1. 安裝依賴失敗
```bash
# 清除 npm 緩存
npm cache clean --force

# 刪除 node_modules 重新安裝
rm -rf node_modules package-lock.json
npm install
```

### 2. 開發服務器無法啟動
```bash
# 檢查端口是否被佔用
lsof -i :3000

# 使用不同端口
npm run dev -- -p 3001
```

### 3. MetaMask 連接失敗
- 確保 MetaMask 已安裝並解鎖
- 切換到 Sepolia 測試網
- 檢查瀏覽器控制台錯誤信息

### 4. 合約調用失敗
- 確保在 Sepolia 測試網
- 檢查合約地址是否正確
- 確保有足夠的測試 ETH

## 📞 支援

如果遇到問題，請檢查：
1. 瀏覽器控制台錯誤信息
2. 終端機錯誤日誌
3. MetaMask 連接狀態
4. 網路連接狀態

## 🎯 功能特色

- ✅ 響應式設計
- ✅ 深色模式支持
- ✅ 錢包連接
- ✅ 智能合約交互
- ✅ 服務瀏覽和購買
- ✅ 訂閱管理
- ✅ 服務創建和管理
- ✅ 測試功能

---

**注意**: 這是一個演示專案，僅用於測試和學習目的。實際部署前請進行充分的安全審計。 