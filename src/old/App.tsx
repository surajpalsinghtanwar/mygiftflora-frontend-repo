// src/App.tsx
// Imports are correct and use consistent paths without extensions
import { Routes, Route } from 'react-router-dom';
import Footer from './components/layout/Footer';
import BottomTabs from './components/layout/BottomTabs';
import ThemeController from './components/common/ThemeController';
import { Toaster } from 'react-hot-toast';
// Import your new ClientOnly wrapper
import ClientOnly from './components/common/ClientOnly'; // Ensure correct path

import Navbar from './components/layout/Navbar';

// Import pages for <Route element>
import HomeSection from './pages/Home/HomeSection';
import { LoginPage } from './pages/Login/LoginPage';
import ProductListingPage from './pages/ProductList/ProductListPage';
import ProductDetailPage from './pages/ProductDetail/ProductDetail';
import { CartPage } from './pages/Cart/CartPage';
import { WishlistPage } from './pages/Wishlist/WishlistPage';
import { CheckoutPage } from './pages/Checkout/CheckoutPage';
import { AccountPage } from './pages/Account/AccountPage';
import { UserProfilePage } from './pages/Account/UserProfilePage';
import { OrderHistoryPage } from './features/account/OrderHistoryPage';
import { TrackOrderPage } from './pages/TrackOrder/TrackOrderPage';
import { SubscriptionPage } from './pages/Subscription/SubscriptionPage';
import Profile from './pages/Home/Profile'; // Ensure Profile.tsx exists

import { useAppDispatch, useAppSelector } from './hooks/reduxHooks'; // Make sure this path is correct

import { useEffect } from 'react';
// ... other imports

// Import Redux hooks
// Import cart actions/selectors
import { hydrateCart, selectIsCartHydrated } from './features/cart/cartSlice';
// --- NEW: Import wishlist action/selector ---
import { hydrateWishlist, selectWishlistHydrationStatus } from './features/wishlist/wishlistSlice'; // Ensure correct 

function App() {
 const dispatch = useAppDispatch();
  // Select the hydration status for both cart and wishlist
  const isCartHydrated = useAppSelector(selectIsCartHydrated);
  // --- NEW: Select wishlist hydration status ---
  const isWishlistHydrated = useAppSelector(selectWishlistHydrationStatus); // Use the new selector
  // --- End NEW ---

  useEffect(() => {
    // This useEffect runs only on the client AFTER the initial render/hydration.
    // Check if we are in a browser environment AND the cart hasn't been hydrated yet.
    if (typeof window !== 'undefined' && !isCartHydrated) {
       console.log("Client: App useEffect dispatching hydrateCart.");
       dispatch(hydrateCart()); // Dispatch cart hydration
    }
     // --- NEW: Dispatch wishlist hydration ---
    if (typeof window !== 'undefined' && !isWishlistHydrated) {
        console.log("Client: App useEffect dispatching hydrateWishlist.");
        dispatch(hydrateWishlist()); // Dispatch wishlist hydration
    }
    // The dependency array includes dispatch (always) and the hydration statuses
  }, [dispatch, isCartHydrated, isWishlistHydrated]); // Depend on both hydration statuses


  return (
    <>
      <ClientOnly>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
      </ClientOnly>
      <div className="flex flex-col min-h-screen">
        <ThemeController />
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <Routes>
            {/* Home page - No SSR Loader defined here */}
            <Route path="/" element={<HomeSection />} />
            <Route path="/profile" element={<Profile />} />

            {/* Product Listing Routes - Loaders defined in routes.tsx */}
            {/* Ensure path parameter names match routes.tsx exactly */}
            <Route path="/products/:category/:subcategory/:subsubcategory" element={<ProductListingPage />} />
            <Route path="/products/:category/:subcategory" element={<ProductListingPage />} />
            <Route path="/products/:category" element={<ProductListingPage />} />

            {/* Product Detail Route - Loader defined in routes.tsx */}
            <Route path="/product/:slug" element={<ProductDetailPage />} />

            {/* Other Routes - No SSR Loaders defined here */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/profile" element={<UserProfilePage />} />
            <Route path="/account/orders" element={<OrderHistoryPage />} />
            <Route path="/account/track-order" element={<TrackOrderPage />} />
            <Route path="/account/subscription" element={<SubscriptionPage />} />

            {/* Consider a 404 route here if not handled by the root route definition */}
          </Routes>
        </main>
        <Footer />
        <BottomTabs />
      </div>
    </>
  );
}

export default App;