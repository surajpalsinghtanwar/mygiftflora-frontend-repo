import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

// A simple helper component for displaying rows of data
const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-3 border-b border-gray-100 last:border-b-0">
    <dt className="font-medium text-sm text-gray-500">{label}</dt>
    <dd className="sm:col-span-2 text-gray-800 font-medium">{value}</dd>
  </div>
);

interface UserData {
  profile: { name: string; email: string; phone: string; };
  shippingAddress: { street: string; city: string; state: string; zipCode: string; };
}

export const ProfileView: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    fetch('/data/mock-user-data.json')
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(err => console.error("Failed to load user data:", err));
  }, []);

  if (!userData) {
    return <div className="flex justify-center p-10"><LoadingSpinner /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Account Overview</h2>
        <Link 
          to="/account/profile" // Link to the editable form page
          className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 text-sm flex items-center gap-2"
        >
          <FaEdit /> Edit Profile
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <dl>
          <InfoRow label="Full Name" value={userData.profile.name} />
          <InfoRow label="Email Address" value={userData.profile.email} />
          <InfoRow label="Phone Number" value={userData.profile.phone} />
        </dl>

        <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Default Shipping Address</h3>
        <dl>
          <InfoRow label="Address" value={userData.shippingAddress.street} />
          <InfoRow label="City" value={userData.shippingAddress.city} />
          <InfoRow label="State & Zip" value={`${userData.shippingAddress.state}, ${userData.shippingAddress.zipCode}`} />
        </dl>
      </div>
    </div>
  );
};