import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Types for our cart system
interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  size?: string;
  personalization?: {
    message?: string;
    uploadedImage?: string;
  };
}

interface CartFlyoutProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartFlyout: React.FC<CartFlyoutProps> = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart items from localStorage
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [isOpen]); // Reload when flyout opens

  // Save cart to localStorage
  const saveCart = (items: CartItem[]) => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
      setCartItems(items);
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  // Update quantity
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }

    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    saveCart(updatedItems);
  };

  // Remove item
  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    saveCart(updatedItems);
  };

  // Clear cart
  const clearCart = () => {
    saveCart([]);
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const shippingCost = subtotal > 500 ? 0 : 50;
  const total = subtotal + shippingCost;

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            style={{ zIndex: 1050 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Cart Flyout */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="position-fixed top-0 end-0 h-100 bg-white shadow-lg"
            style={{ 
              width: '420px', 
              zIndex: 1051,
              maxWidth: '100vw'
            }}
          >
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between p-4 border-bottom">
              <h5 className="mb-0 fw-bold">
                Shopping Cart 
                {itemCount > 0 && (
                  <span className="badge bg-dark ms-2">{itemCount}</span>
                )}
              </h5>
              <button 
                className="btn-close" 
                onClick={onClose}
                aria-label="Close cart"
              />
            </div>

            {/* Cart Content */}
            <div className="d-flex flex-column h-100">
              {isLoading ? (
                <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                  <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center p-4">
                  <div className="mb-4">
                    <i className="bi bi-bag-x display-1 text-muted"></i>
                  </div>
                  <h6 className="text-muted mb-3">Your cart is empty</h6>
                  <p className="text-muted small mb-4">
                    Add some items to your cart to get started
                  </p>
                  <button 
                    className="btn btn-dark"
                    onClick={onClose}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="flex-grow-1 overflow-auto p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="small text-muted">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={clearCart}
                      >
                        Clear All
                      </button>
                    </div>

                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        className="card mb-3 border-0 shadow-sm"
                      >
                        <div className="card-body p-3">
                          <div className="row g-3">
                            <div className="col-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="img-fluid rounded"
                                style={{ aspectRatio: '1', objectFit: 'cover' }}
                              />
                            </div>
                            <div className="col-8">
                              <h6 className="mb-1 fw-semibold">
                                {item.name}
                              </h6>
                              {item.size && (
                                <small className="text-muted d-block mb-1">
                                  Size: {item.size}
                                </small>
                              )}
                              {item.personalization?.message && (
                                <small className="text-muted d-block mb-1">
                                  Message: "{item.personalization.message}"
                                </small>
                              )}
                              
                              <div className="d-flex align-items-center justify-content-between mt-2">
                                <div className="d-flex align-items-center">
                                  <button 
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    style={{ width: '32px', height: '32px' }}
                                  >
                                    <i className="bi bi-dash"></i>
                                  </button>
                                  <span className="mx-3 fw-semibold">{item.quantity}</span>
                                  <button 
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    style={{ width: '32px', height: '32px' }}
                                  >
                                    <i className="bi bi-plus"></i>
                                  </button>
                                </div>
                                <button 
                                  className="btn btn-link text-danger p-0"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>

                              <div className="mt-2">
                                <span className="fw-bold text-dark">
                                  ₹{(item.price * item.quantity).toLocaleString()}
                                </span>
                                {item.originalPrice && item.originalPrice > item.price && (
                                  <span className="text-muted text-decoration-line-through ms-2 small">
                                    ₹{(item.originalPrice * item.quantity).toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Footer with totals and checkout */}
                  <div className="border-top p-4 bg-light">
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Shipping:</span>
                        <span className={shippingCost === 0 ? 'text-success' : ''}>
                          {shippingCost === 0 ? 'Free' : `₹${shippingCost}`}
                        </span>
                      </div>
                      {subtotal < 500 && subtotal > 0 && (
                        <small className="text-muted">
                          Add ₹{(500 - subtotal).toLocaleString()} more for free shipping
                        </small>
                      )}
                      <hr />
                      <div className="d-flex justify-content-between fw-bold">
                        <span>Total:</span>
                        <span className="text-dark">₹{total.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <Link href="/cart" className="btn btn-outline-dark btn-lg w-100 fw-bold">
                          View Cart
                        </Link>
                      </div>
                      <div className="col-6">
                        <Link href="/checkout" className="btn btn-dark btn-lg w-100 fw-bold">
                          Checkout
                        </Link>
                      </div>
                    </div>
                    <div className="text-center mt-2">
                      <button 
                        className="btn btn-link text-muted text-decoration-none"
                        onClick={onClose}
                      >
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartFlyout;