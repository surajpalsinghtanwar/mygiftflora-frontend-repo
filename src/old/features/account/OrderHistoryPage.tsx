import React from 'react';
import { FaBoxOpen } from 'react-icons/fa';
// import { AccountLayout } from './AccountLayout'; // Import the layout
import { EmptyState } from '../../components/common/EmptyState';
import { AccountLayout } from '../../pages/Account/AccountLayout';
// import { AccountLayout } from '../Account/AccountLayout';

export const OrderHistoryPage: React.FC = () => {
  return (
    // Wrap the unique content with the layout
    <AccountLayout>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
      <EmptyState
        icon={<FaBoxOpen size={48} />}
        title="No Orders Yet"
        message="You haven't placed any orders with us. When you do, they'll appear here."
        action={{ to: '/products', label: 'Start Shopping' }}
      />
    </AccountLayout>
  );
};