# 🚀 UniSub Platform - Decentralized NFT Subscription Platform

UniSub is a blockchain-based decentralized NFT subscription platform that enables service providers to create subscription services. Users can purchase subscriptions using USDT and receive NFT-based subscription certificates.

## 🎯 Core Features

### Consumer Portal
- **Wallet Integration**: MetaMask integration with Morph Holesky testnet support
- **Service Discovery**: Browse all available subscription services
- **One-Click Subscription**: Streamlined subscription process with USDT authorization
- **Subscription Management**: View all owned subscription NFTs and renewal functionality
- **Testing Tools**: Mint test USDT tokens for development

### Provider Portal
- **Service Management**: View and manage created subscription services
- **Service Creation**: Create new subscription services (name, symbol, price, duration)
- **Analytics Dashboard**: Total services, active services, subscriber count, revenue statistics
- **Service Details**: Detailed information and statistics for each service

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Blockchain**: Morph Holesky Testnet
- **Smart Contracts**: Solidity
- **Web3 Integration**: ethers.js v5.7.2
- **UI Components**: Lucide React Icons

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Access Application
Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔗 Deployed Contract Addresses (Morph Holesky Testnet)

```
Mock USDT: 0xA2c5e6a98dc69CD3e7c94d3694B7D31DB5FFE33F
Subscription Factory: 0x657296a72483F8F330287B2F1E20293a2a2C2F52

Default Services:
- Netflix Premium: 0x2FCc622C00bBD6961e08C974167a233cd9FFC283 (15 USDT/month)
- Spotify Premium: 0x1c9fFB664d59F60d157e5885C2EdFB287B913091 (10 USDT/month)
```

## 📱 Page Features Overview

### Consumer Portal (`/consumer`)

#### Main Features
1. **Wallet Connection**
   - MetaMask integration
   - Display ETH and USDT balances
   - Network status verification

2. **Service Discovery**
   - Display all available subscription services
   - Service cards with name, price, and duration
   - One-click subscription functionality

3. **My Subscriptions**
   - Display all owned subscription NFTs
   - Subscription status (active/expired)
   - Expiry countdown timer
   - Renewal functionality

4. **Testing Tools**
   - Mint test USDT button
   - 1000 USDT per mint

#### Usage Flow
1. Connect MetaMask wallet
2. Ensure on Morph Holesky testnet
3. Mint test USDT (optional)
4. Browse available services
5. Select service and subscribe
6. Manage subscriptions and renewals

### Provider Portal (`/provider`)

#### Main Features
1. **Service Management Dashboard**
   - Total services statistics
   - Active services count
   - Total subscriber count
   - Total revenue statistics

2. **Create New Service**
   - Service name and symbol
   - Price configuration (USDT)
   - Duration settings (days)
   - Service description

3. **Service List**
   - Display all created services
   - Detailed statistics for each service
   - Service status management

#### Usage Flow
1. Connect MetaMask wallet
2. Ensure on Morph Holesky testnet
3. Click "Create New Service"
4. Fill in service information
5. Confirm service creation
6. View service statistics and management

## 🔧 Development Guide

### Contract ABIs
All contract ABIs are defined in respective page files:
- `FACTORY_ABI`: Factory contract interface
- `SUBSCRIPTION_ABI`: Subscription contract interface
- `USDT_ABI`: USDT token interface

### Styling System
Uses Tailwind CSS with custom CSS classes:
- Responsive design
- Dark mode support
- Animation effects
- Glass morphism effects

### State Management
Uses React Hooks for state management:
- `useState`: Local state management
- `useEffect`: Side effect handling
- Custom hooks (extensible)

## 🎨 Design Features

- **Modern Interface**: Utilizes gradients, shadows, rounded corners and modern design elements
- **Dark Mode**: Complete dark mode support
- **Animation Effects**: Smooth transition animations and hover effects
- **Responsive Design**: Adapts to various screen sizes
- **User Experience**: Clear status feedback and error handling

## 🚨 Important Notes

### Security
- Only supports Morph Holesky testnet operations
- All transactions require user confirmation
- Contract addresses are hardcoded for security

### User Experience
- Clear error messages
- Real-time transaction status feedback
- Loading state handling
- Failure retry mechanism

### Data Formats
- USDT uses 6 decimal places (1 USDT = 1,000,000 wei)
- Time stored as Unix timestamps
- Prices stored in smallest units

## 📚 Resources

- **Testnet**: Morph Holesky Testnet
- **Block Explorer**: https://explorer-holesky.morphl2.io
- **RPC Endpoint**: https://rpc-quicknode-holesky.morphl2.io
- **Framework**: Next.js + ethers.js

## ✅ Development Checklist

### Consumer Portal
- [x] Wallet connection functionality
- [x] Service browsing interface
- [x] Subscription purchase flow
- [x] My subscriptions management
- [x] Renewal functionality
- [x] Test token minting

### Provider Portal  
- [x] Service creation form
- [x] Service management interface
- [x] Statistics dashboard
- [x] Subscriber viewing

### General Features
- [x] Responsive design
- [x] Error handling
- [x] Loading states
- [x] Transaction confirmation flow

---

*💡 Note: This is a complete NFT subscription platform focused on providing a seamless Web3 subscription experience. The smart contracts are fully developed and deployed, enabling direct frontend development based on these contract interfaces.* 