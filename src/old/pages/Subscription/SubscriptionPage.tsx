import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { EmptyState } from '../../components/common/EmptyState';
import { AccountLayout } from '../Account/AccountLayout';

// Let's create a mock subscription object for demonstration
const mockSubscription = {
  isActive: true,
  planName: 'Premium Member',
  price: 999, // in rupees
  billingCycle: 'Yearly',
  nextBillingDate: '2024-12-31',
  benefits: [
    'Free Shipping on all orders',
    'Early access to new arrivals',
    'Exclusive member-only discounts',
    'Priority customer support'
  ]
};

// Set this to false to see the "EmptyState" version
const userHasSubscription = true;

export const SubscriptionPage: React.FC = () => {
  return (
    // Wrap the unique content with the shared AccountLayout
    <AccountLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">My Subscription</h2>
        
        {userHasSubscription ? (
          // Display this card if the user has a subscription
          <div className="bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white border border-gray-700 rounded-xl p-8 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{mockSubscription.planName}</h3>
                <span className="flex items-center gap-2 mt-1 text-green-400 text-sm">
                  <FaCheckCircle /> Active
                </span>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">₹{mockSubscription.price}</p>
                <p className="text-sm text-gray-400">/ {mockSubscription.billingCycle}</p>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-600 pt-6">
              <h4 className="font-semibold mb-3">Your Benefits:</h4>
              <ul className="space-y-2 list-disc list-inside text-gray-300">
                {mockSubscription.benefits.map(benefit => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6 text-sm text-gray-400">
              <p>Your next billing date is on {new Date(mockSubscription.nextBillingDate).toLocaleDateString()}.</p>
            </div>

            <div className="mt-8 flex gap-4">
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                Cancel Subscription
              </button>
              <button className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">
                Change Plan
              </button>
            </div>
          </div>

        ) : (
          // Display this if the user does NOT have a subscription
          <EmptyState
            icon={<FaTimesCircle size={48} />}
            title="No Active Subscription"
            message="You are not currently subscribed to any membership plans."
            action={{ to: '/plans', label: 'View Membership Plans' }}
          />
        )}
      </div>
    </AccountLayout>
  );
};