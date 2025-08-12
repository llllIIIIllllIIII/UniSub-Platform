'use client';

import { useState } from 'react';
import { X, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Subscription, addTransferRecord } from '../lib/mock_data';

interface TransferFormProps {
  subscription: Subscription | null;
  isOpen: boolean;
  onClose: () => void;
  onTransferComplete: () => void;
}

export default function TransferForm({ subscription, isOpen, onClose, onTransferComplete }: TransferFormProps) {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferComplete, setTransferComplete] = useState(false);
  const [error, setError] = useState('');

  const validateAddress = (address: string): boolean => {
    // Basic Ethereum address validation
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethAddressRegex.test(address);
  };

  const handleTransfer = async () => {
    if (!subscription) return;

    setError('');

    if (!recipientAddress.trim()) {
      setError('Please enter recipient wallet address');
      return;
    }

    if (!validateAddress(recipientAddress)) {
      setError('Please enter a valid Ethereum wallet address');
      return;
    }

    setIsTransferring(true);

    try {
      // Simulate transfer process with delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add transfer record to history
      addTransferRecord({
        date: new Date().toISOString().split('T')[0],
        nftName: subscription.name,
        status: 'completed',
        toAddress: recipientAddress,
        txHash: `0x${Math.random().toString(16).substring(2, 10)}...`
      });

      setIsTransferring(false);
      setTransferComplete(true);

      // Auto close after success
      setTimeout(() => {
        setTransferComplete(false);
        setRecipientAddress('');
        onTransferComplete();
        onClose();
      }, 2000);

    } catch (err) {
      setIsTransferring(false);
      setError('Transfer failed. Please try again.');
    }
  };

  const resetForm = () => {
    setRecipientAddress('');
    setError('');
    setTransferComplete(false);
    setIsTransferring(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen || !subscription) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-brand-dark">Transfer NFT Subscription</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {transferComplete ? (
            <div className="text-center py-8">
              <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-brand-dark mb-2">Transfer Successful!</h3>
              <p className="text-gray-600">
                Your NFT subscription has been transferred successfully.
              </p>
            </div>
          ) : (
            <>
              {/* Subscription Info */}
              <div className="bg-brand-bg/50 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-purple to-brand-blue rounded-lg flex items-center justify-center text-white font-semibold">
                    {subscription.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-dark">{subscription.name}</h3>
                    <p className="text-sm text-gray-600">{subscription.provider}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Value:</span>
                  <span className="font-semibold text-brand-dark">
                    {subscription.price} {subscription.currency}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Expires:</span>
                  <span className="font-semibold text-brand-dark">
                    {new Date(subscription.expiryDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4">
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

                {error && (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle size={16} />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {/* Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Important Notice:</p>
                      <p>
                        This transfer is permanent and cannot be undone. Make sure the recipient
                        address is correct before proceeding.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 text-brand-dark border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                    disabled={isTransferring}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTransfer}
                    disabled={isTransferring || !recipientAddress.trim()}
                    className="flex-1 flex items-center justify-center space-x-2 bg-brand-purple hover:bg-brand-blue text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                  >
                    {isTransferring ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Transferring...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Transfer NFT</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Progress indicator */}
        {isTransferring && (
          <div className="px-6 pb-6">
            <div className="bg-brand-bg rounded-lg p-4">
              <div className="flex items-center space-x-3 text-sm text-brand-dark">
                <div className="w-3 h-3 bg-brand-purple rounded-full animate-pulse"></div>
                <span>Processing transfer on blockchain...</span>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                This may take a few moments. Please don't close this window.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}