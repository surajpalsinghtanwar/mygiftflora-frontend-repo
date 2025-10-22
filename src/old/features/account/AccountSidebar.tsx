import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUser, FaBoxOpen, FaHeart, FaMapMarkerAlt, FaSignOutAlt, FaIdCard } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { logout, selectUser } from '../auth/authSlice';
// import type { NavItem } from '../../components/layout/types'; // Your import

export interface NavItem {
  path: string; // The property for the URL
  label: string;
  icon: React.ReactNode;
  // maybe other properties...
}
// Add all navigation items with their full paths
const accountNavItems: NavItem[] = [
  { path: '/account/profile', icon: <FaUser />, label: 'My Profile' },
  { path: '/account/orders', icon: <FaBoxOpen />, label: 'My Orders' },
//   { path: '/account/wishlist', icon: <FaHeart />, label: 'Wishlist' },
  { path: '/account/track-order', icon: <FaMapMarkerAlt />, label: 'Track Order' },
  { path: '/account/subscription', icon: <FaIdCard />, label: 'My Subscription' },
];

const UserAvatar: React.FC = () => (
  <svg className="h-16 w-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export const AccountSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const activeClassName = "bg-orange-600 text-white";
  const inactiveClassName = "text-gray-500 hover:bg-gray-100 hover:text-gray-800";
  const linkBaseClasses = "flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors duration-150";

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex flex-col items-center text-center p-4 border-b border-gray-200 mb-4">
        <UserAvatar />
        <h3 className="mt-2 text-lg font-semibold text-gray-800">{user?.name}</h3>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>

      <nav className="flex-grow space-y-2">
        {accountNavItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `${linkBaseClasses} ${isActive ? activeClassName : inactiveClassName}`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-6">
        <button
          onClick={handleLogout}
          className={`w-full ${linkBaseClasses} ${inactiveClassName} hover:!bg-red-50 hover:!text-red-600`}
        >
          <FaSignOutAlt className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};