import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { FaLock, FaArrowLeft, FaCreditCard, FaTruck, FaCheckCircle } from 'react-icons/fa';
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

interface OrderForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  deliveryDate: string;
  deliveryTime: string;
  paymentMethod: 'online' | 'cod';
  specialInstructions: string;
}

const CheckoutPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
    deliveryDate: '',
    deliveryTime: '10:00-14:00',
    paymentMethod: 'online',
    specialInstructions: ''
  });

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const items = JSON.parse(savedCart);
        if (items.length === 0) {
          router.push('/cart');
          return;
        }
        setCartItems(items);
      } else {
        router.push('/cart');
        return;
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      router.push('/cart');
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 999 ? 0 : 50;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'pincode', 'state', 'deliveryDate'];
    return required.every(field => orderForm[field as keyof OrderForm].toString().trim() !== '');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
      
      // Generate order ID
      const orderId = 'ORD' + Date.now();
      
      // Store order in localStorage (in real app, send to API)
      const order = {
        id: orderId,
        items: cartItems,
        customerInfo: orderForm,
        subtotal: calculateSubtotal(),
        shipping: calculateShipping(),
        total: calculateTotal(),
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      
      // Redirect to success page
      router.push(`/order-success?orderId=${orderId}`);
      
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getMinDeliveryDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
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
        <title>Checkout - MyGiftFlora</title>
        <meta name="description" content="Complete your order securely" />
      </Head>
      
      <Layout>
        <div className="bg-light min-vh-100 py-5">
          <div className="container">
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h1 className="h3 fw-bold mb-2">
                  <FaLock className="text-success me-2" />
                  Secure Checkout
                </h1>
                <p className="text-muted mb-0">Complete your order safely and securely</p>
              </div>
              <button 
                onClick={() => router.push('/cart')} 
                className="btn btn-outline-primary d-flex align-items-center gap-2"
              >
                <FaArrowLeft />
                Back to Cart
              </button>
            </div>

            <form onSubmit={handleSubmitOrder}>
              <div className="row g-4">
                {/* Order Form */}
                <div className="col-lg-8">
                  {/* Customer Information */}
                  <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
                    <h5 className="fw-bold mb-3">Customer Information</h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">First Name *</label>
                        <input 
                          type="text" 
                          name="firstName"
                          value={orderForm.firstName}
                          onChange={handleInputChange}
                          className="form-control" 
                          required 
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Last Name *</label>
                        <input 
                          type="text" 
                          name="lastName"
                          value={orderForm.lastName}
                          onChange={handleInputChange}
                          className="form-control" 
                          required 
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Email Address *</label>
                        <input 
                          type="email" 
                          name="email"
                          value={orderForm.email}
                          onChange={handleInputChange}
                          className="form-control" 
                          required 
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Phone Number *</label>
                        <input 
                          type="tel" 
                          name="phone"
                          value={orderForm.phone}
                          onChange={handleInputChange}
                          className="form-control" 
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
                    <h5 className="fw-bold mb-3">
                      <FaTruck className="text-primary me-2" />
                      Delivery Address
                    </h5>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label">Street Address *</label>
                        <input 
                          type="text" 
                          name="address"
                          value={orderForm.address}
                          onChange={handleInputChange}
                          className="form-control" 
                          placeholder="House/Flat No, Building, Street"
                          required 
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">City *</label>
                        <input 
                          type="text" 
                          name="city"
                          value={orderForm.city}
                          onChange={handleInputChange}
                          className="form-control" 
                          required 
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">PIN Code *</label>
                        <input 
                          type="text" 
                          name="pincode"
                          value={orderForm.pincode}
                          onChange={handleInputChange}
                          className="form-control" 
                          required 
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">State *</label>
                        <input 
                          type="text" 
                          name="state"
                          value={orderForm.state}
                          onChange={handleInputChange}
                          className="form-control" 
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Details */}
                  <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
                    <h5 className="fw-bold mb-3">Delivery Details</h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Delivery Date *</label>
                        <input 
                          type="date" 
                          name="deliveryDate"
                          value={orderForm.deliveryDate}
                          onChange={handleInputChange}
                          className="form-control" 
                          min={getMinDeliveryDate()}
                          required 
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Delivery Time</label>
                        <select 
                          name="deliveryTime"
                          value={orderForm.deliveryTime}
                          onChange={handleInputChange}
                          className="form-control"
                        >
                          <option value="10:00-14:00">10:00 AM - 2:00 PM</option>
                          <option value="14:00-18:00">2:00 PM - 6:00 PM</option>
                          <option value="18:00-22:00">6:00 PM - 10:00 PM</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label">Special Instructions</label>
                        <textarea 
                          name="specialInstructions"
                          value={orderForm.specialInstructions}
                          onChange={handleInputChange}
                          className="form-control" 
                          rows={3}
                          placeholder="Any special delivery instructions..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-white rounded-4 shadow-sm p-4">
                    <h5 className="fw-bold mb-3">
                      <FaCreditCard className="text-success me-2" />
                      Payment Method
                    </h5>
                    <div className="form-check mb-3">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="paymentMethod" 
                        value="online"
                        checked={orderForm.paymentMethod === 'online'}
                        onChange={handleInputChange}
                        id="online-payment" 
                      />
                      <label className="form-check-label fw-medium" htmlFor="online-payment">
                        Online Payment (Recommended)
                      </label>
                      <small className="d-block text-muted">Pay securely using UPI, Cards, or Net Banking</small>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="paymentMethod" 
                        value="cod"
                        checked={orderForm.paymentMethod === 'cod'}
                        onChange={handleInputChange}
                        id="cod-payment" 
                      />
                      <label className="form-check-label fw-medium" htmlFor="cod-payment">
                        Cash on Delivery
                      </label>
                      <small className="d-block text-muted">Pay when your order is delivered</small>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="col-lg-4">
                  <div className="bg-white rounded-4 shadow-sm p-4 sticky-top" style={{ top: '100px' }}>
                    <h5 className="fw-bold mb-3">Order Summary</h5>
                    
                    {/* Order Items */}
                    <div className="mb-3">
                      {cartItems.map((item, index) => (
                        <div key={index} className="d-flex align-items-center gap-2 mb-2 pb-2 border-bottom">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="rounded"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                          <div className="flex-grow-1">
                            <div className="fw-medium small">{item.name}</div>
                            {item.sizeOption && (
                              <small className="text-muted">{item.sizeOption.weight}</small>
                            )}
                            <div className="small">Qty: {item.quantity}</div>
                          </div>
                          <div className="fw-bold small">₹{(item.price * item.quantity).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal</span>
                      <span>₹{calculateSubtotal().toLocaleString()}</span>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-2">
                      <span>Shipping</span>
                      <span>
                        {calculateShipping() === 0 ? (
                          <span className="text-success">FREE</span>
                        ) : (
                          `₹${calculateShipping()}`
                        )}
                      </span>
                    </div>
                    
                    <hr />
                    
                    <div className="d-flex justify-content-between fw-bold mb-4">
                      <span>Total</span>
                      <span className="text-primary">₹{calculateTotal().toLocaleString()}</span>
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={isProcessing || !validateForm()}
                      className="btn btn-primary btn-lg w-100 fw-bold rounded-3"
                    >
                      {isProcessing ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle className="me-2" />
                          Place Order
                        </>
                      )}
                    </button>
                    
                    <div className="text-center mt-3">
                      <small className="text-muted">
                        <FaLock className="me-1" />
                        Your payment information is secure and encrypted
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default CheckoutPage;