import { createSlice, type PayloadAction, createSelector } from '@reduxjs/toolkit';
// Assuming ProductDetailData is compatible with what you store in WishlistItem
import type { ProductDetailData } from '../../types/ProductsTypes'; // Ensure correct import path
import type { RootState } from '../../store'; // Ensure correct import path

// Define the type for a Wishlist item (often similar to a ProductSummary)
// Ensure this interface reflects the actual data you store for a wishlist item
interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number; // Optional property
  image?: string; // Optional image property
  path?: string; // Optional path property
  // Add other properties you need to store for a wishlist item
}

// Define the state shape for the wishlist slice
export interface WishlistState { // Exporting WishlistState for RootState definition
  items: WishlistItem[];
  // Add state properties for client-side loading status and hydration
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; // Status for storage loading
  error: string | null; // Error message for storage loading
  isHydrated: boolean; // Flag to indicate if client-side hydration from storage is done
}

const WISHLIST_STORAGE_KEY = 'shoppingWishlist';

/**
 * Loads the wishlist items from the browser's localStorage.
 * Safely returns an empty array in non-browser environments (like SSR).
 * @returns {WishlistItem[]} The loaded wishlist items, or an empty array if not found or in a non-browser env.
 */
const loadWishlistFromLocalStorage = (): WishlistItem[] => {
  // Check if window (and thus localStorage) is defined
  if (typeof window === 'undefined') {
    // console.log("Server/Non-browser: Cannot access localStorage to load wishlist.");
    return []; // Return empty array on the server or in non-browser environments
  }

  // This code only runs on the client side
  try {
    // console.log("Client: Attempting to load wishlist from localStorage.");
    const serializedState = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (serializedState === null) {
      // console.log("Client: No wishlist found in localStorage.");
      return [];
    }
    const items: WishlistItem[] = JSON.parse(serializedState);
    // console.log("Client: Loaded wishlist from localStorage:", items);
    return items;
  } catch (err) {
    console.error("Client: Error loading wishlist from local storage", err);
    return []; // Return empty array on error
  }
};

/**
 * Saves the current wishlist items to the browser's localStorage.
 * This is called every time the wishlist state is updated (add, remove).
 * Safely does nothing in non-browser environments (like SSR).
 * @param {WishlistItem[]} items - The array of wishlist items to save.
 */
const saveWishlistToLocalStorage = (items: WishlistItem[]): void => {
   // Check if window (and thus localStorage) is defined
   if (typeof window === 'undefined') {
       // console.log("Server/Non-browser: Cannot access localStorage to save wishlist.");
       return; // Do nothing on the server or if localStorage is unavailable
   }

  // This code only runs on the client side
  try {
    // console.log("Client: Saving wishlist to localStorage:", items);
    const serializedState = JSON.stringify(items);
    localStorage.setItem(WISHLIST_STORAGE_KEY, serializedState);
  } catch (err) {
    console.error("Client: Could not save wishlist to local storage", err);
    // You might want to throw the error here if the calling code needs to catch it
  }
};

// --- CORRECTED: Define the DEFAULT initial state ---
const initialState: WishlistState = {
  items: [], // Default to empty array on both server and client initially
  isHydrated: false, // Set to false initially
  status: 'idle', // Initial status for storage loading
  error: null, // Initial error for storage loading
};


export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState, // Use the corrected initialState
  reducers: {
     // --- NEW: Action to be dispatched client-side AFTER hydration ---
     hydrateWishlist(state) { // Define the reducer for the new action
        // Only attempt to load from storage if not already hydrated
        if (!state.isHydrated) {
             console.log("Wishlist Reducer: Hydrating wishlist state from localStorage.");
             try {
                const items = loadWishlistFromLocalStorage(); // This call is safe now
                state.items = items; // Update state with loaded items
                state.isHydrated = true; // Mark as hydrated
                state.status = 'succeeded'; // Indicate success
                state.error = null; // Clear any previous error
             } catch(err: any) {
                 console.error("Wishlist Reducer: Failed to hydrate wishlist from localStorage", err);
                 state.status = 'failed'; // Indicate failure
                 state.error = err.message || 'Failed to hydrate wishlist from storage.'; // Set error message
                 state.isHydrated = true; // Still mark as hydrated (attempted)
             }
        } else {
            console.log("Wishlist Reducer: hydrateWishlist action received, but state already hydrated.");
        }
     },

    // --- UPDATED: Add Item Reducer ---
    // Ensure action payload type matches what you get (e.g., from ProductDetailData)
    // and maps correctly to WishlistItem
    addItem: (state, action: PayloadAction<ProductDetailData>) => { // Assuming payload is ProductDetailData
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);
      if (!existingItem) {
         // Map ProductDetailData to WishlistItem structure
         const newWishlistItem: WishlistItem = {
             id: product.id,
             name: product.name,
             image: product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.png', // Use first image or placeholder
             price: product.price,
             originalPrice: product.originalPrice, // Optional property
             path: `/product/${product.slug}`, // Assuming product.slug maps to your path
             // Add other properties you need
         };
        state.items.push(newWishlistItem);
        // --- CORRECTED: Save to localStorage only on the client ---
        saveWishlistToLocalStorage(state.items); // This call is safe now
      } else {
           console.log(`Item with id ${product.id} is already in the wishlist.`);
           // Optional: Show a toast or update UI to indicate item is already there
      }
    },

    // --- UPDATED: Remove Item Reducer ---
    removeItem: (state, action: PayloadAction<string>) => { // Payload is the item ID to remove
      state.items = state.items.filter((item) => item.id !== action.payload);
      // --- CORRECTED: Save to localStorage only on the client ---
      saveWishlistToLocalStorage(state.items); // This call is safe now
    },
     // Optional: Add a clearWishlist reducer
     clearWishlist: (state) => {
         state.items = [];
         saveWishlistToLocalStorage(state.items);
     },
  },
});

// --- CORRECTED EXPORTS ---
// Export the new hydrateWishlist action creator, plus existing ones
export const { hydrateWishlist, addItem, removeItem /*, clearWishlist */ } = wishlistSlice.actions;

// --- Selectors (Update to use RootState and new state properties) ---
// Basic selectors
export const selectWishlistState = (state: RootState) => state.wishlist;
export const selectWishlistItems = (state: RootState) => state.wishlist.items;
// --- CORRECTED: Export the hydration status selector ---
export const selectWishlistHydrationStatus = (state: RootState) => state.wishlist.isHydrated; // Selector for new flag
// --- END CORRECTED ---
export const selectWishlistStatus = (state: RootState) => state.wishlist.status; // Selector for status
export const selectWishlistError = (state: RootState) => state.wishlist.error; // Selector for error


// Memoized selectors
export const selectWishlistItemCount = createSelector(
    [selectWishlistItems],
    (items) => items.length // Assuming you just want the count of items
);


export const selectIsOnWishlist = (productId: string) =>
  createSelector(
    [selectWishlistItems], // Depends on the array of wishlist items
    (items) => items.some((item) => item.id === productId) // Returns true if item exists
  );

// Selector to indicate if the wishlist is ready to be displayed (hydrated and not loading)
export const selectWishlistReady = createSelector(
    [selectWishlistHydrationStatus, selectWishlistStatus],
    (isHydrated, status) => isHydrated && status !== 'loading'
);


// Export the reducer
export default wishlistSlice.reducer;