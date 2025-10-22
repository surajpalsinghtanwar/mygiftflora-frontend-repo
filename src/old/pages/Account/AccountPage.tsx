import React from 'react';
import { AccountLayout } from './AccountLayout'; // Import the layout
import { ProfileView } from '../../features/account/ProfileView'; // The uneditable view

export const AccountPage: React.FC = () => {
  return (
    // Wrap the unique content with the layout
    <AccountLayout>
      <ProfileView />
    </AccountLayout>
  );
};