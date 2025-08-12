export interface Subscription {
  id: string;
  name: string;
  type: 'video' | 'music' | 'learning';
  price: number;
  currency: string;
  expiryDate: string;
  provider: string;
  image: string;
  isTransferable: boolean;
  description: string;
}

export interface TransferHistory {
  id: string;
  date: string;
  nftName: string;
  status: 'completed' | 'pending' | 'failed';
  toAddress: string;
  txHash?: string;
}

export const mockSubscriptions: Subscription[] = [
  {
    id: 'nft-001',
    name: 'Netflix Premium Access',
    type: 'video',
    price: 15.99,
    currency: 'USDC',
    expiryDate: '2024-12-31',
    provider: 'Netflix',
    image: '/api/placeholder/100/100',
    isTransferable: true,
    description: '4K streaming, multiple screens, unlimited content'
  },
  {
    id: 'nft-002',
    name: 'Spotify Premium',
    type: 'music',
    price: 9.99,
    currency: 'USDT',
    expiryDate: '2024-11-15',
    provider: 'Spotify',
    image: '/api/placeholder/100/100',
    isTransferable: true,
    description: 'Ad-free music, offline downloads, high quality audio'
  },
  {
    id: 'nft-003',
    name: 'Masterclass Annual',
    type: 'learning',
    price: 180.00,
    currency: 'USDC',
    expiryDate: '2025-03-20',
    provider: 'MasterClass',
    image: '/api/placeholder/100/100',
    isTransferable: true,
    description: 'Learn from world-class experts in various fields'
  },
  {
    id: 'nft-004',
    name: 'Adobe Creative Suite',
    type: 'learning',
    price: 52.99,
    currency: 'USDT',
    expiryDate: '2024-10-30',
    provider: 'Adobe',
    image: '/api/placeholder/100/100',
    isTransferable: false,
    description: 'Complete creative tools for design and video editing'
  },
  {
    id: 'nft-005',
    name: 'Disney+ Bundle',
    type: 'video',
    price: 13.99,
    currency: 'USDC',
    expiryDate: '2024-12-25',
    provider: 'Disney',
    image: '/api/placeholder/100/100',
    isTransferable: true,
    description: 'Disney+, Hulu, and ESPN+ bundle access'
  }
];

export const mockTransferHistory: TransferHistory[] = [
  {
    id: 'tx-001',
    date: '2024-08-01',
    nftName: 'Udemy Pro Annual',
    status: 'completed',
    toAddress: '0x742d35Cc6464C532d15C5d95B3B7e9A5bE964b3A',
    txHash: '0xabc123...'
  },
  {
    id: 'tx-002',
    date: '2024-07-28',
    nftName: 'YouTube Premium',
    status: 'completed',
    toAddress: '0x8ba1f109551bD432803012645Hac136c59DB264d',
    txHash: '0xdef456...'
  },
  {
    id: 'tx-003',
    date: '2024-07-25',
    nftName: 'LinkedIn Learning',
    status: 'pending',
    toAddress: '0x123456789abcdef123456789abcdef123456789a'
  },
  {
    id: 'tx-004',
    date: '2024-07-20',
    nftName: 'Amazon Prime Video',
    status: 'failed',
    toAddress: '0x987654321fedcba987654321fedcba9876543210'
  }
];

// Utility functions for localStorage
export const getStoredSubscriptions = (): Subscription[] => {
  if (typeof window === 'undefined') return mockSubscriptions;
  
  const stored = localStorage.getItem('unisub-subscriptions');
  return stored ? JSON.parse(stored) : mockSubscriptions;
};

export const saveSubscriptions = (subscriptions: Subscription[]): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('unisub-subscriptions', JSON.stringify(subscriptions));
};

export const getStoredHistory = (): TransferHistory[] => {
  if (typeof window === 'undefined') return mockTransferHistory;
  
  const stored = localStorage.getItem('unisub-history');
  return stored ? JSON.parse(stored) : mockTransferHistory;
};

export const saveHistory = (history: TransferHistory[]): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('unisub-history', JSON.stringify(history));
};

export const addTransferRecord = (record: Omit<TransferHistory, 'id'>): void => {
  const history = getStoredHistory();
  const newRecord: TransferHistory = {
    ...record,
    id: `tx-${Date.now()}`
  };
  
  history.unshift(newRecord);
  saveHistory(history);
};