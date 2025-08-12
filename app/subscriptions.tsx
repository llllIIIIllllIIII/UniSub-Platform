'use client';

import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';
import SubscriptionCard from '../components/SubscriptionCard';
import TransferForm from '../components/transfer_form';
import { getStoredSubscriptions, Subscription } from '../lib/mock_data';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isTransferFormOpen, setIsTransferFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setSubscriptions(getStoredSubscriptions());
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleTransfer = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsTransferFormOpen(true);
  };

  const handleTransferComplete = () => {
    // Refresh subscriptions after transfer (in real app, this would update the NFT ownership)
    setSubscriptions(getStoredSubscriptions());
  };

  const calculateTotalValue = () => {
    return subscriptions.reduce((total, sub) => total + sub.price, 0).toFixed(2);
  };

  const getActiveSubscriptions = () => {
    const now = new Date();
    return subscriptions.filter(sub => new Date(sub.expiryDate) > now);
  };

  const getExpiringSoon = () => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return subscriptions.filter(sub => {
      const expiryDate = new Date(sub.expiryDate);
      return expiryDate > now && expiryDate <= thirtyDaysFromNow;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-bg via-white to-brand-bg">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-brand-dark font-medium">Loading your subscriptions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-bg via-white to-brand-bg">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-dark mb-2">My NFT Subscriptions</h1>
          <p className="text-gray-600">Manage your subscription assets and track your spending</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Value</p>
                <p className="text-2xl font-bold text-brand-dark">${calculateTotalValue()}</p>
              </div>
              <div className="w-12 h-12 bg-brand-purple/10 rounded-lg flex items-center justify-center">
                <DollarSign size={24} className="text-brand-purple" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active NFTs</p>
                <p className="text-2xl font-bold text-brand-dark">{getActiveSubscriptions().length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Wallet size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Expiring Soon</p>
                <p className="text-2xl font-bold text-brand-dark">{getExpiringSoon().length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Calendar size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Transferable</p>
                <p className="text-2xl font-bold text-brand-dark">
                  {subscriptions.filter(sub => sub.isTransferable).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Subscriptions Grid */}
        {subscriptions.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet size={32} className="text-brand-purple" />
            </div>
            <h3 className="text-xl font-semibold text-brand-dark mb-2">No Subscriptions Yet</h3>
            <p className="text-gray-600 mb-6">
              You don't have any subscription NFTs. Start by purchasing your first subscription.
            </p>
            <button className="btn-primary">
              Browse Available Subscriptions
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-brand-dark">Your Subscription NFTs</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Total: {subscriptions.length} NFTs</span>
                <span>•</span>
                <span>Value: ${calculateTotalValue()}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onTransfer={handleTransfer}
                />
              ))}
            </div>
          </>
        )}

        {/* Expiring Soon Alert */}
        {getExpiringSoon().length > 0 && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <Calendar size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Subscriptions Expiring Soon</h3>
                <p className="text-yellow-700 text-sm mb-3">
                  {getExpiringSoon().length} subscription{getExpiringSoon().length !== 1 ? 's' : ''} 
                  {getExpiringSoon().length === 1 ? ' is' : ' are'} expiring within 30 days.
                </p>
                <div className="space-y-1">
                  {getExpiringSoon().map(sub => (
                    <div key={sub.id} className="text-sm text-yellow-700">
                      • {sub.name} expires on {new Date(sub.expiryDate).toLocaleDateString()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transfer Form Modal */}
      <TransferForm
        subscription={selectedSubscription}
        isOpen={isTransferFormOpen}
        onClose={() => {
          setIsTransferFormOpen(false);
          setSelectedSubscription(null);
        }}
        onTransferComplete={handleTransferComplete}
      />

      <Footer />
    </div>
  );
}