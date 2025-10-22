import type { CartItem } from '../types/CartTypes';

/**
 * Calculates the total number of individual items in the cart.
 * @param items - The array of cart items.
 * @returns The total quantity of all items.
 */
export const calculateItemCount = (items: CartItem[]): number => {
  if (!items || items.length === 0) {
    return 0;
  }
  return items.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Calculates the subtotal price of all items in the cart.
 * @param items - The array of cart items.
 * @returns The total price of all items.
 */
export const calculateSubtotal = (items: CartItem[]): number => {
  if (!items || items.length === 0) {
    return 0;
  }
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};