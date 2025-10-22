import React, { useState } from 'react';
import { AccountSidebar } from '../../features/account/AccountSidebar';
import { FaBars, FaTimes } from 'react-icons/fa';

// This component accepts other components as 'children'
export const AccountLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
            My Account
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Welcome back! Manage your profile, orders, and more.
          </p>
        </header>

        {/* --- Main Content Panel --- */}
        <div className="bg-white rounded-xl shadow-lg lg:flex">
          {/* --- Desktop Sidebar --- */}
          <aside className="hidden lg:block lg:w-1/4 lg:border-r border-gray-200">
            <AccountSidebar />
          </aside>

          {/* --- Mobile Menu Button (This will now appear on every page) --- */}
          <div className="lg:hidden p-4 border-b border-gray-200">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center gap-3 w-full bg-white p-3 rounded-lg shadow-sm border text-gray-700 font-medium"
            >
              <FaBars className="text-orange-600" />
              Account Menu
            </button>
          </div>
          
          {/* --- Main Content (This is where the unique page content will go) --- */}
          <main className="flex-1 p-6 lg:p-10">
            {children} {/* We render the specific page content here */}
          </main>
        </div>
      </div>

      {/* --- Mobile Off-canvas Menu (This logic is now centralized) --- */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-60 z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          {/* Menu */}
          <div className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-xl z-40 lg:hidden transform transition-transform duration-300 ease-in-out translate-x-0">
            <div className="flex justify-end p-4">
              <button onClick={() => setMobileMenuOpen(false)}>
                <FaTimes size={24} className="text-gray-500" />
              </button>
            </div>
            {/* Close menu on link click */}
            <div onClick={() => setMobileMenuOpen(false)}>
              <AccountSidebar />
            </div>
          </div>
        </>
      )}
    </div>
  );
};