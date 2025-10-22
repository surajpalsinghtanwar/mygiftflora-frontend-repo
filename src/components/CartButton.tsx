import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CartFlyout from './CartFlyout';

interface CartItem {
  id: string;
  quantity: number;
}

const CartButton: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const cartItems: CartItem[] = JSON.parse(savedCart);
          const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
          setItemCount(count);
        } else {
          setItemCount(0);
        }
      } catch (error) {
        console.error('Error loading cart count:', error);
        setItemCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    updateCartCount();

    // Listen for storage changes (when cart is updated from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        updateCartCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Listen for custom cart update events (when cart is updated in same tab)
    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <>
      <button
        className="btn btn-outline-dark position-relative me-2"
        onClick={openCart}
        disabled={isLoading}
      >
        <i className="bi bi-bag"></i>
        <span className="d-none d-md-inline ms-2">Cart</span>
        
        <AnimatePresence>
          {itemCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark"
              style={{ fontSize: '0.75rem' }}
            >
              {itemCount > 99 ? '99+' : itemCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <CartFlyout isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

// Helper function to trigger cart update events
export const triggerCartUpdate = () => {
  window.dispatchEvent(new CustomEvent('cartUpdated'));
};

export default CartButton;