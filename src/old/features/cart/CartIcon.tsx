import React from 'react';
import { useCart } from '../../hooks/useCart';

interface CartIconProps {
  onClick: () => void;
}

export const CartIcon: React.FC<CartIconProps> = ({ onClick }) => {
  const { itemCount, subtotal } = useCart();

  return (
    <button 
      onClick={onClick} 
      className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors"
      aria-label={`Open cart with ${itemCount} items, subtotal ₹${subtotal.toLocaleString()}`}
    >
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>

        {itemCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {itemCount}
            </span>
        )}
      </div>
      <div className="hidden md:block text-left">
        <span className="block text-xs">My Cart</span>
        <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
      </div>
    </button>
  );
};