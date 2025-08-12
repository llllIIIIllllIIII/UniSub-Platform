'use client';

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../lib/Web3Context';
import { addAndSwitchToMorphHolesky, MORPH_HOLESKY_CHAIN_ID } from '../lib/networkUtils';

interface NetworkSwitchPromptProps {
  onClose?: () => void;
}

const NetworkSwitchPrompt: React.FC<NetworkSwitchPromptProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { chainId, isConnected } = useWeb3();

  useEffect(() => {
    // 只在已連接錢包但不在 Morph Holesky 網路時顯示
    if (isConnected && chainId && chainId !== MORPH_HOLESKY_CHAIN_ID) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [chainId, isConnected]);

  const handleSwitchNetwork = async () => {
    setIsLoading(true);
    try {
      const success = await addAndSwitchToMorphHolesky();
      if (success) {
        setIsVisible(false);
        onClose?.();
      }
    } catch (error) {
      console.error('Network switch failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="bg-gradient-to-r from-brand-blue/95 to-brand-purple/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 14.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Switch to Morph Holesky</h3>
              <p className="text-white/80 text-sm">Recommended network for optimal experience</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-white/90 text-sm mb-6">
          UniSub Platform works best on Morph Holesky Testnet. Switch now for access to all features and the latest deployed contracts.
        </p>

        <div className="flex space-x-3">
          <button
            onClick={handleSwitchNetwork}
            disabled={isLoading}
            className="flex-1 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed backdrop-blur-sm rounded-xl px-4 py-3 font-medium transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Switching...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <span>Switch Network</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleDismiss}
            className="px-4 py-3 text-white/80 hover:text-white transition-colors text-sm font-medium"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkSwitchPrompt;
