'use client';

import { Calendar, DollarSign, ExternalLink, Send } from 'lucide-react';
import { Subscription } from '../lib/mock_data';

interface SubscriptionCardProps {
  subscription: Subscription;
  onTransfer: (subscription: Subscription) => void;
}

export default function SubscriptionCard({ subscription, onTransfer }: SubscriptionCardProps) {
  const isExpiringSoon = () => {
    const expiryDate = new Date(subscription.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30;
  };

  const getDaysUntilExpiry = () => {
    const expiryDate = new Date(subscription.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'Expired';
    if (daysUntilExpiry === 0) return 'Expires today';
    if (daysUntilExpiry === 1) return '1 day left';
    return `${daysUntilExpiry} days left`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800';
      case 'music': return 'bg-green-100 text-green-800';
      case 'learning': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎬';
      case 'music': return '🎵';
      case 'learning': return '📚';
      default: return '📱';
    }
  };

  return (
    <div className="card group animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-purple to-brand-blue rounded-xl flex items-center justify-center text-xl">
            {getTypeIcon(subscription.type)}
          </div>
          <div>
            <h3 className="font-semibold text-brand-dark text-lg group-hover:text-brand-purple transition-colors duration-300">
              {subscription.name}
            </h3>
            <p className="text-sm text-gray-600">{subscription.provider}</p>
          </div>
        </div>
        
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(subscription.type)}`}>
          {subscription.type}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {subscription.description}
      </p>

      {/* Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <DollarSign size={16} />
            <span>Price</span>
          </div>
          <span className="font-semibold text-brand-dark">
            {subscription.price} {subscription.currency}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar size={16} />
            <span>Expiry</span>
          </div>
          <span className={`font-medium ${isExpiringSoon() ? 'text-red-600' : 'text-brand-dark'}`}>
            {getDaysUntilExpiry()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onTransfer(subscription)}
          disabled={!subscription.isTransferable}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex-1 justify-center ${
            subscription.isTransferable
              ? 'bg-brand-purple hover:bg-brand-blue text-white hover:scale-105 active:scale-95 shadow-md hover:shadow-lg'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Send size={16} />
          <span>{subscription.isTransferable ? 'Transfer' : 'Non-transferable'}</span>
        </button>

        <button className="p-2 text-gray-500 hover:text-brand-purple hover:bg-brand-bg rounded-lg transition-all duration-300 hover:scale-110">
          <ExternalLink size={16} />
        </button>
      </div>

      {/* Transfer status indicator */}
      {subscription.isTransferable && (
        <div className="mt-3 flex items-center space-x-2 text-xs text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Available for transfer</span>
        </div>
      )}
    </div>
  );
}