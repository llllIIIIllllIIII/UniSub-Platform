'use client';

import { ExternalLink, Clock, CheckCircle, XCircle, Copy } from 'lucide-react';
import { TransferHistory } from '../lib/mock_data';

interface HistoryTableProps {
  history: TransferHistory[];
}

export default function HistoryTable({ history }: HistoryTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock size={24} className="text-brand-purple" />
        </div>
        <h3 className="text-lg font-semibold text-brand-dark mb-2">No Transfer History</h3>
        <p className="text-gray-600">
          When you transfer NFT subscriptions, they'll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-brand-bg border-b border-gray-100">
        <h2 className="text-lg font-semibold text-brand-dark">Transfer History</h2>
        <p className="text-sm text-gray-600 mt-1">
          Track all your NFT subscription transfers
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NFT Subscription
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recipient
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-brand-bg/30 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-dark">
                  {formatDate(item.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-brand-dark">{item.nftName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                      {truncateAddress(item.toAddress)}
                    </code>
                    <button
                      onClick={() => copyToClipboard(item.toAddress)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
                      title="Copy full address"
                    >
                      <Copy size={12} className="text-gray-500" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.txHash ? (
                    <button
                      onClick={() => window.open(`https://etherscan.io/tx/${item.txHash}`, '_blank')}
                      className="flex items-center space-x-1 text-brand-purple hover:text-brand-blue transition-colors duration-200"
                    >
                      <span className="text-xs font-mono">{truncateAddress(item.txHash)}</span>
                      <ExternalLink size={12} />
                    </button>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-100">
        {history.map((item) => (
          <div key={item.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-brand-dark">{item.nftName}</h3>
                <p className="text-sm text-gray-600">{formatDate(item.date)}</p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(item.status)}
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Recipient:</span>
                <div className="flex items-center space-x-2">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                    {truncateAddress(item.toAddress)}
                  </code>
                  <button
                    onClick={() => copyToClipboard(item.toAddress)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
                  >
                    <Copy size={12} className="text-gray-500" />
                  </button>
                </div>
              </div>
              
              {item.txHash && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Transaction:</span>
                  <button
                    onClick={() => window.open(`https://etherscan.io/tx/${item.txHash}`, '_blank')}
                    className="flex items-center space-x-1 text-brand-purple"
                  >
                    <span className="text-xs font-mono">{truncateAddress(item.txHash)}</span>
                    <ExternalLink size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}