// src/features/checkout/OrderSummary.tsx

import { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { FaSpinner } from 'react-icons/fa';

export const OrderSummary: React.FC = () => {
  const { items, subtotal, discount, shippingCost, total, applyCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = () => {
    // Don't do anything if the input is empty
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    // Simulate network delay for better UX
    setTimeout(() => {
      applyCoupon(couponCode);
      setIsApplyingCoupon(false);
    }, 500);
  };

  return (
    <div className="w-full bg-gray-50 p-6 lg:p-8 h-full flex flex-col">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>

      {/* Product List */}
      <div className="flex-grow space-y-4 mb-6 overflow-y-auto pr-2 border-b pb-4">
        {items.length > 0 ? (
          items.map(item => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 rounded-md object-cover" 
                  />
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-600 text-xs font-bold text-white">
                    {item.quantity}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 leading-tight">{item.name}</p>
                  <p className="text-gray-500">₹{item.price.toLocaleString()}</p>
                </div>
              </div>
              <p className="font-semibold text-gray-800">
                ₹{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">Your cart is empty.</p>
        )}
      </div>
      
      {/* Coupon Form */}
      <div className="flex gap-2 mb-4">
        <input 
          type="text" 
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
          className="w-full rounded-md border-gray-300 p-2 text-sm focus:ring-gray-800 focus:border-gray-800"
        />
        <button 
          onClick={handleApplyCoupon} 
          disabled={isApplyingCoupon || !couponCode.trim()}
          className="bg-gray-800 text-white font-semibold px-4 rounded-md hover:bg-black transition-colors text-sm w-28 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isApplyingCoupon ? <FaSpinner className="animate-spin"/> : 'Apply'}
        </button>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-2 border-t pt-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Discount (SALE10)</span>
            <span>- ₹{discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className={shippingCost === 0 && subtotal > 0 ? 'font-semibold text-green-600' : ''}>
            {subtotal === 0 ? '—' : (shippingCost === 0 ? 'FREE' : `₹${shippingCost.toLocaleString()}`)}
          </span>
        </div>
        <div className="flex justify-between font-bold text-lg text-gray-800 border-t pt-2 mt-2">
          <span>Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};