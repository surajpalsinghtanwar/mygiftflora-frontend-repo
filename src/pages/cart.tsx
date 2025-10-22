import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import Head from 'next/head';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  sizeOption?: {
    id: string;
    weight: string;
    serves: string;
  };
  customMessage?: string;
  uploadedImage?: File;
}

const CartPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = (itemIndex: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeCartItem(itemIndex);
      return;
    }

    const updatedCart = [...cartItems];
    updatedCart[itemIndex].quantity = newQuantity;
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeCartItem = (itemIndex: number) => {
    const updatedCart = cartItems.filter((_, index) => index !== itemIndex);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 999 ? 0 : 50; // Free shipping above ₹999
    return subtotal + shipping;
  };

  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Shopping Cart - MyGiftFlora</title>
        <meta name="description" content="Review your cart items and proceed to checkout" />
      </Head>
      
      <Layout>
        <div className="bg-light min-vh-100 py-5">
          <div className="container">
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h1 className="h3 fw-bold mb-2">Shopping Cart</h1>
                <p className="text-muted mb-0">{cartItems.length} items in your cart</p>
              </div>
              <button 
                onClick={() => router.back()} 
                className="btn btn-outline-primary d-flex align-items-center gap-2"
              >
                <FaArrowLeft />
                Continue Shopping
              </button>
            </div>

            {cartItems.length === 0 ? (
              /* Empty Cart */
              <div className="text-center py-5">
                <div className="mb-4">
                  <FaShoppingCart size={64} className="text-muted" />
                </div>
                <h3 className="fw-bold mb-3">Your cart is empty</h3>
                <p className="text-muted mb-4">Add some items to your cart to continue shopping</p>
                <button 
                  onClick={() => router.push('/products')} 
                  className="btn btn-primary btn-lg px-5"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {/* Cart Items */}
                <div className="col-lg-8">
                  <div className="bg-white rounded-4 shadow-sm p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="fw-bold mb-0">Cart Items</h5>
                      <button 
                        onClick={clearCart} 
                        className="btn btn-outline-danger btn-sm"
                      >
                        Clear Cart
                      </button>
                    </div>

                    {cartItems.map((item, index) => (
                      <div key={index} className="cart-item border-bottom pb-4 mb-4">
                        <div className="row g-3 align-items-center">
                          {/* Product Image */}
                          <div className="col-md-3">
                            <img 
                              src={item.imageUrl} 
                              alt={item.name} 
                              className="img-fluid rounded-3"
                              style={{ height: '120px', objectFit: 'cover' }}
                            />
                          </div>

                          {/* Product Details */}
                          <div className="col-md-6">
                            <h6 className="fw-bold mb-2">{item.name}</h6>
                            
                            {item.sizeOption && (
                              <div className="mb-2">
                                <small className="text-muted">Size: </small>
                                <span className="fw-medium">{item.sizeOption.weight}</span>
                                <small className="text-muted ms-2">({item.sizeOption.serves})</small>
                              </div>
                            )}

                            {item.customMessage && (
                              <div className="mb-2">
                                <small className="text-success">
                                  💬 Message: "{item.customMessage}"
                                </small>
                              </div>
                            )}

                            {item.uploadedImage && (
                              <div className="mb-2">
                                <small className="text-success">
                                  📸 Custom Photo Uploaded
                                </small>
                              </div>
                            )}

                            <div className="text-primary fw-bold">
                              ₹{item.price.toLocaleString()}
                            </div>
                          </div>

                          {/* Quantity & Actions */}
                          <div className="col-md-3">
                            <div className="d-flex align-items-center justify-content-between">
                              {/* Quantity Controls */}
                              <div className="d-flex align-items-center bg-light rounded-pill">
                                <button 
                                  onClick={() => updateCartItem(index, item.quantity - 1)}
                                  className="btn btn-sm btn-light rounded-circle"
                                  style={{ width: '32px', height: '32px' }}
                                >
                                  <FaMinus size={12} />
                                </button>
                                <span className="px-3 fw-bold">{item.quantity}</span>
                                <button 
                                  onClick={() => updateCartItem(index, item.quantity + 1)}
                                  className="btn btn-sm btn-light rounded-circle"
                                  style={{ width: '32px', height: '32px' }}
                                >
                                  <FaPlus size={12} />
                                </button>
                              </div>

                              {/* Remove Button */}
                              <button 
                                onClick={() => removeCartItem(index)}
                                className="btn btn-outline-danger btn-sm rounded-circle"
                                style={{ width: '32px', height: '32px' }}
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>

                            <div className="text-end mt-2">
                              <strong>₹{(item.price * item.quantity).toLocaleString()}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="col-lg-4">
                  <div className="bg-white rounded-4 shadow-sm p-4 sticky-top" style={{ top: '100px' }}>
                    <h5 className="fw-bold mb-4">Order Summary</h5>
                    
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>₹{calculateSubtotal().toLocaleString()}</span>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-2">
                      <span>Shipping</span>
                      <span>
                        {calculateSubtotal() > 999 ? (
                          <span className="text-success">FREE</span>
                        ) : (
                          '₹50'
                        )}
                      </span>
                    </div>
                    
                    {calculateSubtotal() <= 999 && (
                      <div className="alert alert-info small py-2 mb-3">
                        Add ₹{(999 - calculateSubtotal()).toLocaleString()} more for free shipping!
                      </div>
                    )}
                    
                    <hr />
                    
                    <div className="d-flex justify-content-between fw-bold mb-4">
                      <span>Total</span>
                      <span className="text-primary">₹{calculateTotal().toLocaleString()}</span>
                    </div>
                    
                    <button 
                      onClick={() => router.push('/checkout')}
                      className="btn btn-primary btn-lg w-100 fw-bold rounded-3"
                    >
                      Proceed to Checkout
                    </button>
                    
                    <div className="text-center mt-3">
                      <small className="text-muted">Secure checkout • SSL encrypted</small>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default CartPage;