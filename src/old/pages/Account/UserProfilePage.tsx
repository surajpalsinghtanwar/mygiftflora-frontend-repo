import React from 'react';
import { AccountLayout } from './AccountLayout'; // Import the layout
import { ProfileEditForm } from '../../features/account/ProfileEditForm'; // The editable form

export const UserProfilePage: React.FC = () => {
  return (
    // Wrap the unique content with the layout
    <AccountLayout>
      <ProfileEditForm />
    </AccountLayout>
  );
};