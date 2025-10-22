// src/features/cart/cartSlice.ts
import { createSlice, type PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { CartItem } from '../../types/CartTypes'; // Ensure correct import path
import type { ProductDetailData } from '../../types/ProductsTypes'; // Ensure correct import path
import type { RootState } from '../../store'; // Ensure correct import path
// Assuming these utility functions are safe to run on server/client
import { calculateItemCount, calculateSubtotal } from '../../utils/cartUtils'; // Ensure correct import path

// Import the service functions (now safe to import in any environment)
import { loadCartFromLocalStorage, saveCartToLocalStorage } from '../../services/cartService'; // Ensure correct import path

// Define shipping constants (Keep these)
const SHIPPING_COST = 50;
const FREE_SHIPPING_THRESHOLD = 500; // Free shipping on orders over ₹500

export interface CartState {
  items: CartItem[];
  discount: number;
  // --- NEW: Add a flag to indicate if client-side hydration from storage has occurred ---
  isHydrated: boolean;
  // Add status/error if you have API calls for the cart (useful even for localStorage loading status)
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// --- CORRECTED: Define the DEFAULT initial state for the cart slice ---
// This state is used on the server during SSR and initially on the client.
// It does NOT load from localStorage here during module evaluation.
const initialState: CartState = {
  items: [], // Default to empty array on both server and client initially
  discount: 0,
  isHydrated: false, // Set to false initially
  status: 'idle', // Initial status
  error: null, // Initial error
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState, // Use the corrected initialState
  reducers: {
    // --- NEW: Action to be dispatched client-side AFTER hydration to load from localStorage ---
    // This reducer's logic is safe because loadCartFromLocalStorage is safe.
    // The check !state.isHydrated is important to only attempt hydration once.
    hydrateCart(state) {
      // Only attempt to load from storage if not already hydrated
      if (!state.isHydrated) {
          console.log("Cart Reducer: Hydrating cart state from localStorage.");
          try {
            const items = loadCartFromLocalStorage(); // This call is safe now
            state.items = items; // Update state with loaded items
            state.isHydrated = true; // Mark as hydrated
            state.status = 'succeeded'; // Indicate success
            state.error = null; // Clear any previous error
          } catch (err: any) {
             console.error("Cart Reducer: Failed to hydrate cart from localStorage", err);
             state.status = 'failed'; // Indicate failure
             state.error = err.message || 'Failed to hydrate cart from storage.'; // Set error message
             state.isHydrated = true; // Still mark as hydrated (attempted)
          }
      } else {
           console.log("Cart Reducer: HydrateCart action received, but state already hydrated.");
      }
    },

    // --- UPDATED: Add Item Reducer ---
    addItem: (state, action: PayloadAction<{ product: ProductDetailData; quantity: number }>) => {
      const { product, quantity } = action.payload;
      // Ensure quantity is positive before adding
      const validatedQuantity = Math.max(1, quantity);
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += validatedQuantity;
      } else {
        // Ensure newItem matches your CartItem type structure
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice, // Optional property, make sure your type allows undefined
          // Assuming product.images is string[] and you want the first one
          image: product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.png',
          // Assuming product detail data has a 'slug' that maps to a 'path' structure
          path: `/product/${product.slug}`, // Ensure product.slug exists and matches your routing structure
          quantity: validatedQuantity,
        };
        state.items.push(newItem);
      }
      // --- CORRECTED: Save to localStorage only on the client ---
      saveCartToLocalStorage(state.items); // This call is safe now because saveCartToLocalStorage is safe
    },

    // --- UPDATED: Remove Item Reducer ---
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
       // --- CORRECTED: Save to localStorage only on the client ---
      saveCartToLocalStorage(state.items); // This call is safe now
    },

    // --- UPDATED: Update Quantity Reducer ---
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const validatedQuantity = Math.max(1, quantity); // Ensure quantity is at least 1
      const itemToUpdate = state.items.find((item) => item.id === id);
      if (itemToUpdate) {
        itemToUpdate.quantity = validatedQuantity;
      }
       // --- CORRECTED: Save to localStorage only on the client ---
      saveCartToLocalStorage(state.items); // This call is safe now
    },

    // --- UPDATED: Clear Cart Reducer ---
    clearCart: (state) => {
      state.items = [];
      state.discount = 0; // Assuming clearing cart also clears discount
       // --- CORRECTED: Save to localStorage only on the client ---
      saveCartToLocalStorage(state.items); // This call is safe now
    },

    // --- Keep applyDiscount Reducer (no localStorage involved) ---
    applyDiscount: (state, action: PayloadAction<number>) => {
        // Ensure discount is non-negative
        state.discount = Math.max(0, action.payload);
        // Saving discount to localStorage might also be desired if you add validation
        // and want to persist it. You'd need a separate saveDiscountToLocalStorage service.
    },

     // Add reducers for API responses if you add async thunks later
     // setApiCart(state, action: PayloadAction<CartItem[]>) { ... }
     // setCartLoading(state) { ... }
     // setCartFailed(state, action: PayloadAction<string | null>) { ... }
  },
});

// Export the new hydrateCart action creator, plus existing ones
export const {
  hydrateCart, // NEW action creator
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  applyDiscount
} = cartSlice.actions;


// --- Selectors (Keep these, they work with the state structure) ---
// Basic selectors
export const selectCartState = (state: RootState) => state.cart; // Selector for the entire cart state
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectDiscount = (state: RootState) => state.cart.discount;
export const selectIsCartHydrated = (state: RootState) => state.cart.isHydrated; // Selector for new flag
export const selectCartStatus = (state: RootState) => state.cart.status; // Selector for status
export const selectCartError = (state: RootState) => state.cart.error; // Selector for error


// Memoized selectors for calculated values
export const selectCartItemCount = createSelector(
  [selectCartItems],
  (items) => calculateItemCount(items) // Assumes calculateItemCount utility exists
);

export const selectCartSubtotal = createSelector(
  [selectCartItems],
  (items) => calculateSubtotal(items) // Assumes calculateSubtotal utility exists
);

// Dynamic shipping cost selector based on subtotal
export const selectShippingCost = createSelector(
  [selectCartSubtotal],
  (subtotal) => (subtotal > FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST)
);

// Final total calculation including subtotal, discount, and shipping
export const selectCartFinalTotal = createSelector(
  [selectCartSubtotal, selectDiscount, selectShippingCost],
  (subtotal, discount, shippingCost) => {
    const finalTotal = subtotal - discount + shippingCost;
    return Math.max(0, finalTotal); // Ensure total is not negative
  }
);

// Selector to indicate if the cart is ready to be displayed (hydrated and not loading)
export const selectCartReady = createSelector(
    [selectIsCartHydrated, selectCartStatus], // Depends on hydration status and status
    (isHydrated, status) => isHydrated && status !== 'loading'
);


// Export the reducer
export default cartSlice.reducer;