'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, AlertTriangle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';
import { getStoredSubscriptions, addTransferRecord, Subscription } from '../lib/mock_data';

export default function TransferPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setSubscriptions(getStoredSubscriptions());
  }, []);

  const validateAddress = (address: string): boolean => {
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethAddressRegex.test(address);
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedSubscription) {
      setError('Please select a subscription to transfer');
      return;
    }

    if (!recipientAddress.trim()) {
      setError('Please enter recipient wallet address');
      return;
    }

    if (!validateAddress(recipientAddress)) {
      setError('Please enter a valid Ethereum wallet address');
      return;
    }

    const subscription = subscriptions.find(sub => sub.id === selectedSubscription);
    if (!subscription?.isTransferable) {
      setError('This subscription is not transferable');
      return;
    }

    setIsTransferring(true);

    try {
      // Simulate transfer process
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Add transfer record
      addTransferRecord({
        date: new Date().toISOString().split('T')[0],
        nftName: subscription.name,
        status: 'completed',
        toAddress: recipientAddress,
        txHash: `0x${Math.random().toString(16).substring(2, 10)}...`
      });

      // Redirect to history page after successful transfer
      router.push('/history?success=true');

    } catch (err) {
      setIsTransferring(false);
      setError('Transfer failed. Please try again.');
    }
  };

  const transferableSubscriptions = subscriptions.filter(sub => sub.isTransferable);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-bg via-white to-brand-bg">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-brand-purple hover:text-brand-blue transition-colors duration-300 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-brand-dark mb-2">Transfer NFT Subscription</h1>
          <p className="text-gray-600">Send your subscription NFT to another wallet address</p>
        </div>

        {/* Transfer Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleTransfer} className="space-y-6">
            {/* Subscription Selection */}
            <div>
              <label htmlFor="subscription" className="block text-sm font-medium text-brand-dark mb-2">
                Select Subscription to Transfer
              </label>
              <select
                id="subscription"
                value={selectedSubscription}
                onChange={(e) => setSelectedSubscription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all duration-200"
                disabled={isTransferring}
              >
                <option value="">Choose a subscription...</option>
                {transferableSubscriptions.map((subscription) => (
                  <option key={subscription.id} value={subscription.id}>
                    {subscription.name} - {subscription.price} {subscription.currency}
                  </option>
                ))}
              </select>
              {transferableSubscriptions.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  No transferable subscriptions available
                </p>
              )}
            </div>

            {/* Selected Subscription Preview */}
            {selectedSubscription && (
              <div className="bg-brand-bg/50 rounded-xl p-4">
                {(() => {
                  const subscription = subscriptions.find(sub => sub.id === selectedSubscription);
                  return subscription ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-brand-purple to-brand-blue rounded-lg flex items-center justify-center text-white font-semibold">
                        {subscription.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-brand-dark">{subscription.name}</h3>
                        <p className="text-sm text-gray-600">{subscription.provider}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-brand-dark">
                          {subscription.price} {subscription.currency}
                        </p>
                        <p className="text-xs text-gray-500">
                          Expires: {new Date(subscription.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            {/* Recipient Address */}
            <div>
              <label htmlFor="recipient" className="block text-sm font-medium text-brand-dark mb-2">
                Recipient Wallet Address
              </label>
              <input
                id="recipient"
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all duration-200"
                disabled={isTransferring}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a valid Ethereum wallet address (0x...)
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertTriangle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Important Notice:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• This transfer is permanent and cannot be undone</li>
                    <li>• Verify the recipient address is correct</li>
                    <li>• Ensure the recipient can access NFTs on this network</li>
                    <li>• Transfer may take a few minutes to complete</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isTransferring || !selectedSubscription || !recipientAddress.trim()}
              className="w-full flex items-center justify-center space-x-2 bg-brand-purple hover:bg-brand-blue text-white px-6 py-4 rounded-lg font-medium transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            >
              {isTransferring ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Transfer...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Transfer NFT</span>
                </>
              )}
            </button>
          </form>

          {/* Progress indicator */}
          {isTransferring && (
            <div className="mt-6 bg-brand-bg rounded-lg p-4">
              <div className="flex items-center space-x-3 text-sm text-brand-dark">
                <div className="w-3 h-3 bg-brand-purple rounded-full animate-pulse"></div>
                <span>Processing transfer on blockchain...</span>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                This may take a few moments. Please don't close this page.
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-brand-dark mb-4">Need Help?</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>What happens after transfer?</strong><br />
              The NFT ownership will be transferred to the recipient's wallet. They will gain full access to the subscription service.
            </p>
            <p>
              <strong>Can I cancel a transfer?</strong><br />
              No, blockchain transfers are irreversible. Make sure all details are correct before confirming.
            </p>
            <p>
              <strong>Transfer fees?</strong><br />
              Gas fees may apply depending on network conditions. This demo version simulates transfers without actual blockchain interaction.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}