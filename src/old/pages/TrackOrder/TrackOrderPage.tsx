import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { AccountLayout } from '../Account/AccountLayout';

export const TrackOrderPage: React.FC = () => {
  const [trackingId, setTrackingId] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      toast.error('Please enter an Order ID or Tracking Number.');
      return;
    }
    
    setIsSearching(true);
    toast.loading('Searching for your order...');
    
    // Simulate a network request for tracking
    setTimeout(() => {
      setIsSearching(false);
      toast.dismiss();
      // In a real app, you would show the tracking info.
      // For now, we'll just show a success message.
      toast.success(`Tracking details for #${trackingId} would be shown here.`);
    }, 2000);
  };

  return (
    // Wrap the unique content with the shared AccountLayout
    <AccountLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Track Your Order</h2>
        <p className="text-sm text-gray-500">
          Enter your Order ID or Tracking Number below to see its status.
        </p>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div>
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-700">
                Order ID / Tracking Number
              </label>
              <input
                type="text"
                id="orderId"
                name="orderId"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="e.g., ORD-12345XYZ"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSearching}
              className="flex items-center gap-2 justify-center bg-orange-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-orange-700 disabled:opacity-60"
            >
              <FaSearch />
              {isSearching ? 'Searching...' : 'Track Order'}
            </button>
          </form>
        </div>
      </div>
    </AccountLayout>
  );
};