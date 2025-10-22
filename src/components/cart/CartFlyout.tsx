import React from 'react';

interface CartFlyoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartFlyout: React.FC<CartFlyoutProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>
      
      {/* Cart Flyout */}
      <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Shopping Cart</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-gray-500 text-center">Your cart is empty</p>
        </div>
      </div>
    </>
  );
};