'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Download, Filter, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';
import HistoryTable from '../components/history_table';
import { getStoredHistory, TransferHistory } from '../lib/mock_data';

export default function HistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [history, setHistory] = useState<TransferHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<TransferHistory[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const data = getStoredHistory();
    setHistory(data);
    setFilteredHistory(data);

    // Check if redirected from successful transfer
    if (searchParams.get('success') === 'true') {
      setShowSuccessMessage(true);
      // Remove success message after 5 seconds
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, [searchParams]);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredHistory(history);
    } else {
      setFilteredHistory(history.filter(item => item.status === statusFilter));
    }
  }, [history, statusFilter]);

  const handleExportCSV = () => {
    const csvContent = [
      ['Date', 'NFT Name', 'Status', 'Recipient Address', 'Transaction Hash'],
      ...filteredHistory.map(item => [
        item.date,
        item.nftName,
        item.status,
        item.toAddress,
        item.txHash || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'unisub-transfer-history.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusCounts = () => {
    return {
      all: history.length,
      completed: history.filter(item => item.status === 'completed').length,
      pending: history.filter(item => item.status === 'pending').length,
      failed: history.filter(item => item.status === 'failed').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-bg via-white to-brand-bg">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 animate-fade-in">
            <div className="flex items-center space-x-3">
              <CheckCircle size={20} className="text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Transfer Successful!</h3>
                <p className="text-sm text-green-700">Your NFT subscription has been transferred successfully.</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-brand-purple hover:text-brand-blue transition-colors duration-300 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-brand-dark mb-2">Transfer History</h1>
              <p className="text-gray-600">Track all your NFT subscription transfers</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center space-x-2 bg-white hover:bg-brand-bg text-brand-dark border border-gray-200 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
              >
                <Download size={16} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-brand-dark">{statusCounts.all}</p>
              <p className="text-sm text-gray-600">Total Transfers</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{statusCounts.completed}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{statusCounts.failed}</p>
              <p className="text-sm text-gray-600">Failed</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <Filter size={20} className="text-brand-purple" />
            <span className="font-medium text-brand-dark">Filter by status:</span>
            <div className="flex items-center space-x-2">
              {[
                { value: 'all', label: 'All', count: statusCounts.all },
                { value: 'completed', label: 'Completed', count: statusCounts.completed },
                { value: 'pending', label: 'Pending', count: statusCounts.pending },
                { value: 'failed', label: 'Failed', count: statusCounts.failed },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    statusFilter === filter.value
                      ? 'bg-brand-purple text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-brand-bg'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* History Table */}
        <HistoryTable history={filteredHistory} />

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-brand-dark mb-4">Quick Actions</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push('/transfer')}
              className="flex-1 bg-brand-purple hover:bg-brand-blue text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
            >
              Make New Transfer
            </button>
            <button
              onClick={() => router.push('/subscriptions')}
              className="flex-1 bg-white hover:bg-brand-bg text-brand-purple border-2 border-brand-purple px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
            >
              View My Subscriptions
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-brand-bg/50 rounded-2xl p-6">
          <h3 className="font-semibold text-brand-dark mb-4">About Transfer History</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-brand-dark mb-2">Status Meanings:</h4>
              <ul className="space-y-1">
                <li><span className="text-green-600">●</span> <strong>Completed:</strong> Transfer successful and confirmed</li>
                <li><span className="text-yellow-600">●</span> <strong>Pending:</strong> Transfer in progress on blockchain</li>
                <li><span className="text-red-600">●</span> <strong>Failed:</strong> Transfer failed due to error or insufficient gas</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-brand-dark mb-2">Important Notes:</h4>
              <ul className="space-y-1">
                <li>• All transfers are recorded permanently on blockchain</li>
                <li>• Failed transfers can be retried with adjusted gas fees</li>
                <li>• Pending transfers may take several minutes to confirm</li>
                <li>• Export your history for record keeping</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}