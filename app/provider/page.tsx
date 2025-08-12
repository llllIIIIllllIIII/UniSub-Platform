'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { 
  Wallet, 
  Building2, 
  Plus, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Settings,
  BarChart3
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/footer';
import { PrimaryButton, SecondaryButton } from '../../components/buttons';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useWeb3 } from '../../lib/Web3Context';
import { useLanguage } from '../../lib/LanguageContext';
import { 
  getContractConfig,
  FACTORY_ABI,
  SUBSCRIPTION_ABI 
} from '../../lib/contracts';

// 添加 window.ethereum 的類型聲明
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface Service {
  address: string;
  name: string;
  symbol: string;
  owner: string;
  price: string;
  duration: number;
  createdAt: Date;
  isActive: boolean;
  totalSubscribers?: number;
  activeSubscribers?: number;
  revenue?: string;
}

interface CreateServiceForm {
  name: string;
  symbol: string;
  price: string;
  duration: string;
  description: string;
}

export default function ProviderPage() {
  const { 
    isConnected, 
    userAddress, 
    ethBalance, 
    provider,
    signer,
    chainId,
    isCorrectNetwork,
    connectWallet,
    switchToSepolia
  } = useWeb3();
  
  const { t } = useLanguage();
  
  const [myServices, setMyServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState<CreateServiceForm>({
    name: '',
    symbol: '',
    price: '',
    duration: '',
    description: ''
  });

  // 載入我的服務
  const loadMyServices = async (address: string) => {
    if (!provider || !chainId) {
      console.log('❌ No provider available for loadMyServices');
      return;
    }
    
    try {
      console.log('🔍 Loading services for provider:', address);
      console.log('🔗 Chain ID:', chainId);
      
      const config = getContractConfig(chainId);
      console.log('📋 Using contract config:', config);
      
      const factoryContract = new ethers.Contract(
        config.contracts.subscriptionFactory,
        FACTORY_ABI,
        provider
      );
      
      console.log('📞 Getting provider collections...');
      const collections = await factoryContract.getCollectionsByOwner(address);
      console.log('📦 Found provider collections:', collections);
      
      const servicesData: Service[] = [];
      
      for (const collectionAddress of collections) {
        try {
          console.log('🔍 Loading info for collection:', collectionAddress);
          const info = await factoryContract.getCollectionInfo(collectionAddress);
          console.log('📋 Collection info:', info);
          
          const subscriptionContract = new ethers.Contract(
            collectionAddress,
            SUBSCRIPTION_ABI,
            provider
          );
          
          // 計算統計數據
          const totalSubscribers = await subscriptionContract.balanceOf(address);
          const price = await subscriptionContract.price();
          const priceFormatted = ethers.utils.formatUnits(price, 6);
          
          servicesData.push({
            address: collectionAddress,
            name: info.name,
            symbol: info.symbol,
            owner: info.owner,
            price: ethers.utils.formatUnits(info.price, 6),
            duration: info.duration.toNumber() / (24 * 60 * 60),
            createdAt: new Date(info.createdAt.toNumber() * 1000),
            isActive: info.isActive,
            totalSubscribers: totalSubscribers.toNumber(),
            activeSubscribers: totalSubscribers.toNumber(), // 簡化，實際應該檢查到期時間
            revenue: (totalSubscribers.toNumber() * parseFloat(priceFormatted)).toFixed(2)
          });
        } catch (collectionError) {
          console.error(`❌ Error loading collection ${collectionAddress}:`, collectionError);
          continue;
        }
      }
      
      console.log('✅ Services loaded:', servicesData);
      setMyServices(servicesData);
    } catch (error) {
      console.error('💥 Error loading services:', error);
      setError('Failed to load services');
    }
  };

  // 創建新服務
  const createNewService = async () => {
    if (!signer || !userAddress || !chainId) {
      setError('請先連接錢包');
      return;
    }

    try {
      setIsLoading(true);
      setLoadingMessage('Creating new service...');
      
      console.log('🔧 Creating new service with:', createForm);
      
      const config = getContractConfig(chainId);
      const factoryContract = new ethers.Contract(
        config.contracts.subscriptionFactory,
        FACTORY_ABI,
        signer
      );
      
      const priceWei = ethers.utils.parseUnits(createForm.price, 6);
      const durationSeconds = parseInt(createForm.duration) * 24 * 60 * 60;
      
      console.log('📞 Calling createSubscriptionCollection...');
      console.log('Parameters:', {
        name: createForm.name,
        symbol: createForm.symbol,
        price: priceWei.toString(),
        duration: durationSeconds
      });
      
      const createTx = await factoryContract.createSubscriptionCollection(
        createForm.name,
        createForm.symbol,
        priceWei,
        durationSeconds
      );
      
      setLoadingMessage('Waiting for transaction confirmation...');
      console.log('⏳ Waiting for transaction:', createTx.hash);
      const receipt = await createTx.wait();
      console.log('✅ Transaction confirmed:', receipt);
      
      // 重新載入服務列表
      await loadMyServices(userAddress);
      
      // 重置表單
      setCreateForm({
        name: '',
        symbol: '',
        price: '',
        duration: '',
        description: ''
      });
      setShowCreateForm(false);
      
      setIsLoading(false);
      setError('');
    } catch (error) {
      console.error('💥 Error creating service:', error);
      setError(`Failed to create service: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  // 處理表單輸入
  const handleFormChange = (field: keyof CreateServiceForm, value: string) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 驗證表單
  const validateForm = () => {
    return createForm.name && 
           createForm.symbol && 
           createForm.price && 
           createForm.duration &&
           parseFloat(createForm.price) > 0 &&
           parseInt(createForm.duration) > 0;
  };

  // 計算總統計
  const calculateTotalStats = () => {
    const totalServices = myServices.length;
    const activeServices = myServices.filter(s => s.isActive).length;
    const totalSubscribers = myServices.reduce((sum, s) => sum + (s.totalSubscribers || 0), 0);
    const totalRevenue = myServices.reduce((sum, s) => sum + parseFloat(s.revenue || '0'), 0);
    
    return { totalServices, activeServices, totalSubscribers, totalRevenue };
  };

  useEffect(() => {
    if (isConnected && userAddress && provider) {
      console.log('🔄 Loading provider data for user:', userAddress);
      loadMyServices(userAddress);
    }
  }, [isConnected, userAddress, provider]);

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg dark:bg-dark-bg transition-all duration-500">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-brand-dark dark:text-dark-text font-medium mt-4">{loadingMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg dark:bg-dark-bg transition-all duration-500">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
                    <h1 className="text-fluid-4xl font-bold text-brand-dark dark:text-dark-text mb-6">
            {t('provider.manageServices')}
          </h1>
          <p className="text-gray-600 dark:text-dark-text-secondary">
            {t('provider.description')}
          </p>
        </div>

        {/* Wallet Connection */}
        {!isConnected ? (
          <div className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-md rounded-3xl p-8 text-center mb-8">
            <Building2 size={64} className="text-brand-purple mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-brand-dark dark:text-dark-text mb-4">
              {t('provider.connectWallet')}
            </h2>
            <p className="text-gray-600 dark:text-dark-text-secondary mb-6">
              {t('provider.connectWallet')}
            </p>
            <PrimaryButton onClick={connectWallet} className="text-lg px-8 py-4 flex items-center justify-center">
              <Wallet size={20} className="mr-2" />
              {t('nav.connectWallet')}
            </PrimaryButton>
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle size={20} className="text-red-500 mr-2" />
                  <span className="text-red-700 dark:text-red-300">{error}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Wallet Info */}
            <div className="card mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary mb-1">{t('provider.connectedProvider')}</p>
                  <p className="text-lg font-bold text-brand-dark dark:text-dark-text">
                    {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            {/* Statistics Overview */}
            {(() => {
              const stats = calculateTotalStats();
              return (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-dark-text-secondary mb-1">{t('provider.totalServices')}</p>
                        <p className="text-2xl font-bold text-brand-dark dark:text-dark-text">{stats.totalServices}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <Building2 size={24} className="text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-dark-text-secondary mb-1">{t('provider.activeServices')}</p>
                        <p className="text-2xl font-bold text-brand-dark dark:text-dark-text">{stats.activeServices}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-dark-text-secondary mb-1">{t('provider.totalSubscribers')}</p>
                        <p className="text-2xl font-bold text-brand-dark dark:text-dark-text">{stats.totalSubscribers}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                        <Users size={24} className="text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-dark-text-secondary mb-1">{t('provider.totalRevenue')}</p>
                        <p className="text-2xl font-bold text-brand-dark dark:text-dark-text">${stats.totalRevenue.toFixed(2)}</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                        <DollarSign size={24} className="text-yellow-600 dark:text-yellow-400" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Create New Service */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-fluid-2xl font-bold text-brand-dark dark:text-dark-text">
                  {t('provider.myServices')}
                </h2>
                <PrimaryButton 
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center justify-center"
                >
                  <Plus size={20} className="mr-2" />
                  {t('provider.createService')}
                </PrimaryButton>
              </div>

              {/* Create Service Form */}
              {showCreateForm && (
                <div className="card mb-6">
                  <h3 className="text-xl font-bold text-brand-dark dark:text-dark-text mb-4">
                    {t('provider.createService')}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-2">
                        {t('provider.serviceName')}
                      </label>
                      <input
                        type="text"
                        value={createForm.name}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                        placeholder="e.g., Netflix Premium"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-dark-surface/50 rounded-lg bg-white dark:bg-dark-card text-brand-dark dark:text-dark-text focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-2">
                        {t('provider.serviceSymbol')}
                      </label>
                      <input
                        type="text"
                        value={createForm.symbol}
                        onChange={(e) => handleFormChange('symbol', e.target.value)}
                        placeholder="e.g., NFLX"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-dark-surface/50 rounded-lg bg-white dark:bg-dark-card text-brand-dark dark:text-dark-text focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-2">
                        {t('provider.servicePrice')}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={createForm.price}
                        onChange={(e) => handleFormChange('price', e.target.value)}
                        placeholder="15.00"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-dark-surface/50 rounded-lg bg-white dark:bg-dark-card text-brand-dark dark:text-dark-text focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-2">
                        {t('provider.serviceDuration')}
                      </label>
                      <input
                        type="number"
                        value={createForm.duration}
                        onChange={(e) => handleFormChange('duration', e.target.value)}
                        placeholder="30"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-dark-surface/50 rounded-lg bg-white dark:bg-dark-card text-brand-dark dark:text-dark-text focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-2">
                      {t('provider.serviceDescription')}
                    </label>
                    <textarea
                      value={createForm.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      placeholder={t('provider.descriptionPlaceholder')}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-dark-surface/50 rounded-lg bg-white dark:bg-dark-card text-brand-dark dark:text-dark-text focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <PrimaryButton 
                      onClick={createNewService}
                      disabled={!validateForm() || isLoading}
                      className="flex items-center justify-center"
                    >
                      <Plus size={20} className="mr-2" />
                      {isLoading ? t('provider.creating') : t('provider.create')}
                    </PrimaryButton>
                    <SecondaryButton 
                      onClick={() => setShowCreateForm(false)}
                      className="flex items-center justify-center"
                    >
                      {t('common.cancel')}
                    </SecondaryButton>
                  </div>
                </div>
              )}

              {/* Services List */}
              {myServices.length === 0 ? (
                <div className="card text-center py-12">
                  <Building2 size={64} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-brand-dark dark:text-dark-text mb-2">
                    {t('provider.noServices')}
                  </h3>
                  <p className="text-gray-600 dark:text-dark-text-secondary mb-4">
                    {t('provider.noServicesDescription')}
                  </p>
                  <PrimaryButton 
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center justify-center mx-auto"
                  >
                    <Plus size={20} className="mr-2" />
                    {t('provider.createService')}
                  </PrimaryButton>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myServices.map((service) => (
                    <div key={service.address} className="card group hover-lift">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-brand-dark dark:text-dark-text">
                          {service.name}
                        </h3>
                        {service.isActive ? (
                          <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle size={20} className="text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-dark-text-secondary">{t('provider.symbol')}:</span>
                          <span className="font-mono text-sm text-brand-dark dark:text-dark-text">
                            {service.symbol}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-dark-text-secondary">{t('provider.price')}:</span>
                          <span className="font-bold text-brand-dark dark:text-dark-text">
                            {service.price} USDT
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-dark-text-secondary">{t('provider.duration')}:</span>
                          <span className="font-bold text-brand-dark dark:text-dark-text">
                            {service.duration} {t('provider.days')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-dark-text-secondary">{t('provider.subscribers')}:</span>
                          <span className="font-bold text-brand-dark dark:text-dark-text">
                            {service.totalSubscribers || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-dark-text-secondary">{t('provider.revenue')}:</span>
                          <span className="font-bold text-green-600 dark:text-green-400">
                            ${service.revenue || '0.00'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <SecondaryButton className="flex-1 flex items-center justify-center">
                          <BarChart3 size={16} className="mr-2" />
                          {t('provider.analytics')}
                        </SecondaryButton>
                        <SecondaryButton className="flex-1 flex items-center justify-center">
                          <Settings size={16} className="mr-2" />
                          {t('provider.settings')}
                        </SecondaryButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
} 