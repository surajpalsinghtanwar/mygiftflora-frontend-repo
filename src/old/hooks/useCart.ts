// src/hooks/useCart.ts
import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAppSelector, useAppDispatch } from './reduxHooks'; // Ensure correct import path
import {
  // Import action creators
  addItem as addItemAction,
  removeItem as removeItemAction,
  updateQuantity as updateQuantityAction,
  clearCart as clearCartAction,
  applyDiscount as applyDiscountAction,
  // Import selectors
  selectCartItems,
  selectCartItemCount,
  selectCartSubtotal,
  selectDiscount,
  selectShippingCost, // Import shippingCost selector
  selectCartFinalTotal, // Import finalTotal selector
  selectIsCartHydrated, // Import the hydration status selector
  selectCartStatus, // Import cart status selector
  selectCartError, // Import cart error selector
  selectCartReady, // Import the ready selector (Optional, but useful)
} from '../features/cart/cartSlice'; // Ensure correct import path

import type { ProductDetailData } from '../types/ProductsTypes'; // Ensure correct import path
import type { CartItem } from '../types/CartTypes'; // Ensure correct import path

interface UseCartReturn {
  // Expose state properties from selectors
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingCost: number; // Expose shippingCost
  total: number; // Expose total
  isHydrated: boolean; // Expose hydration status (useful for loading states in components)
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; // Expose cart status
  error: string | null; // Expose cart error
  isReady: boolean; // Expose ready status (Optional)

  // Expose action dispatchers (wrapped in useCallback)
  addItem: (product: ProductDetailData, quantity: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  // Keep applyCoupon logic within the hook or move to a thunk later
  applyCoupon: (code: string) => boolean;
}

export const useCart = (): UseCartReturn => {
  const dispatch = useAppDispatch();

  // Use selectors to get state
  const items = useAppSelector(selectCartItems);
  const itemCount = useAppSelector(selectCartItemCount);
  const subtotal = useAppSelector(selectCartSubtotal);
  const discount = useAppSelector(selectDiscount);
  const shippingCost = useAppSelector(selectShippingCost); // Get shipping cost from selector
  const total = useAppSelector(selectCartFinalTotal); // Get final total from selector
  const isHydrated = useAppSelector(selectIsCartHydrated); // Get hydration status
  const status = useAppSelector(selectCartStatus); // Get cart status
  const error = useAppSelector(selectCartError); // Get cart error
  const isReady = useAppSelector(selectCartReady); // Get ready status (Optional)


  // Wrap action dispatchers in useCallback
  const addItem = useCallback(
    (product: ProductDetailData, quantity: number) => {
       // Add validation if quantity <= 0 before dispatching
       if (quantity > 0) {
          dispatch(addItemAction({ product, quantity }));
       } else {
           console.warn("Attempted to add item with non-positive quantity:", quantity);
       }
    },
    [dispatch] // Dependency on dispatch
  );

  const removeItem = useCallback((id: string) => {
      dispatch(removeItemAction(id));
  }, [dispatch]); // Dependency on dispatch

  const updateQuantity = useCallback((id: string, quantity: number) => {
    // Ensure quantity is positive before dispatching
    if (quantity > 0) {
      dispatch(updateQuantityAction({ id, quantity }));
    } else {
        console.warn("Attempted to update item quantity to non-positive value:", quantity);
        // Optional: You might want to remove the item if quantity is set to 0
        // dispatch(removeItemAction(id));
    }
  }, [dispatch]); // Dependency on dispatch

  const clearCart = useCallback(() => {
      dispatch(clearCartAction());
  }, [dispatch]); // Dependency on dispatch

  // Keep applyCoupon logic within the hook for now
  const applyCoupon = useCallback(
    (code: string): boolean => {
      // Simple hardcoded coupon logic for example
      if (code && code.toUpperCase() === 'SALE10') {
        const discountAmount = subtotal * 0.10; // Calculate 10% discount based on current subtotal
        dispatch(applyDiscountAction(discountAmount));
        toast.success('Coupon "SALE10" applied!');
        return true;
      } else {
        // Clear any previous discount if code is invalid or empty
        dispatch(applyDiscountAction(0));
        if (code) { // Only show error toast if a non-empty code was entered
            toast.error('Invalid coupon code.');
        }
        return false;
      }
    },
    [dispatch, subtotal] // Dependency on dispatch and subtotal (discount depends on subtotal)
  );

  // Return the state properties and action dispatchers
  return {
    items,
    itemCount,
    subtotal,
    discount,
    shippingCost,
    total,
    isHydrated, // Expose hydration status
    status, // Expose cart status
    error, // Expose cart error
    isReady, // Expose ready status (Optional)

    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
  };
};