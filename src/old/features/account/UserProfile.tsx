import React, { useState } from 'react';
import { useAppSelector } from '../../hooks/reduxHooks';
import { selectUser } from '../auth/authSlice';
import { FloatingLabelInput } from '../../components/common/FloatingLabelInput';

export const UserProfile: React.FC = () => {
  const user = useAppSelector(selectUser);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleEditToggle = () => setIsEditing(prev => !prev);

  if (!user) {
    // The type guard `!user` ensures `user` is not null below
    return <div>Loading user information...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
          <p className="mt-1 text-sm text-gray-500">Manage your personal information and account security.</p>
        </div>
        <button
          type="button"
          onClick={handleEditToggle}
          className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <form className="space-y-6">
        <FloatingLabelInput
          id="name"
          label="Full Name"
          type="text"
          defaultValue={user.name}
          disabled={!isEditing}
        />
        <FloatingLabelInput
          id="email"
          label="Email Address"
          type="email"
          defaultValue={user.email}
          disabled // Email is typically not editable
        />
        {isEditing && (
          <FloatingLabelInput
            id="password"
            label="New Password"
            type="password"
            placeholder="Leave blank to keep current password"
          />
        )}
        {isEditing && (
          <div className="pt-4 text-right">
            <button
              type="submit"
              className="bg-orange-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-orange-700"
            >
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};