import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { FaCheckCircle, FaTruck, FaWhatsapp, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import Head from 'next/head';
import Link from 'next/link';

interface Order {
  id: string;
  items: any[];
  customerInfo: any;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: string;
}

const OrderSuccessPage = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrder(orderId as string);
    }
  }, [orderId]);

  const loadOrder = (orderIdParam: string) => {
    try {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const foundOrder = orders.find((o: Order) => o.id === orderIdParam);
      
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error loading order:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const getDeliveryDate = () => {
    if (!order) return '';
    return new Date(order.customerInfo.deliveryDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareOrderWhatsApp = () => {
    if (!order) return;
    
    const message = `🎉 Great news! My order has been confirmed!
    
Order ID: ${order.id}
Total: ₹${order.total.toLocaleString()}
Delivery Date: ${getDeliveryDate()}

Thank you MyGiftFlora for the easy ordering process! 🎂🌸🎁`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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

  if (!order) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <h2>Order not found</h2>
          <p>The order you're looking for doesn't exist.</p>
          <Link href="/" className="btn btn-primary">Go Home</Link>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Order Confirmed - MyGiftFlora</title>
        <meta name="description" content="Your order has been successfully placed" />
      </Head>
      
      <Layout>
        <div className="bg-light min-vh-100 py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6">
                {/* Success Message */}
                <div className="text-center mb-5">
                  <div className="mb-4">
                    <FaCheckCircle size={80} className="text-success" />
                  </div>
                  <h1 className="h2 fw-bold text-success mb-2">Order Confirmed!</h1>
                  <p className="text-muted lead">
                    Thank you for your order. We'll start preparing it right away!
                  </p>
                </div>

                {/* Order Details Card */}
                <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">Order Details</h5>
                    <span className="badge bg-success px-3 py-2">Confirmed</span>
                  </div>
                  
                  <div className="row g-3 mb-4">
                    <div className="col-6">
                      <small className="text-muted">Order ID</small>
                      <div className="fw-bold">{order.id}</div>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Order Date</small>
                      <div className="fw-bold">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Delivery Date</small>
                      <div className="fw-bold text-primary">{getDeliveryDate()}</div>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Delivery Time</small>
                      <div className="fw-bold">{order.customerInfo.deliveryTime}</div>
                    </div>
                  </div>

                  <div className="border-top pt-3">
                    <small className="text-muted">Delivery Address</small>
                    <div className="fw-medium">
                      {order.customerInfo.firstName} {order.customerInfo.lastName}<br />
                      {order.customerInfo.address}<br />
                      {order.customerInfo.city}, {order.customerInfo.state} - {order.customerInfo.pincode}<br />
                      📞 {order.customerInfo.phone}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
                  <h6 className="fw-bold mb-3">Order Items</h6>
                  {order.items.map((item, index) => (
                    <div key={index} className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="rounded"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                      <div className="flex-grow-1">
                        <div className="fw-medium">{item.name}</div>
                        {item.sizeOption && (
                          <small className="text-muted">Size: {item.sizeOption.weight}</small>
                        )}
                        {item.customMessage && (
                          <div className="small text-success mt-1">
                            💬 "{item.customMessage}"
                          </div>
                        )}
                        {item.uploadedImage && (
                          <div className="small text-success mt-1">
                            📸 Custom Photo Uploaded
                          </div>
                        )}
                        <div className="small text-muted">Quantity: {item.quantity}</div>
                      </div>
                      <div className="fw-bold">₹{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
                    <span>₹{order.subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping</span>
                    <span>
                      {order.shipping === 0 ? (
                        <span className="text-success">FREE</span>
                      ) : (
                        `₹${order.shipping}`
                      )}
                    </span>
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total Paid</span>
                    <span className="text-primary">₹{order.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* What's Next */}
                <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
                  <h6 className="fw-bold mb-3">
                    <FaTruck className="text-primary me-2" />
                    What's Next?
                  </h6>
                  <div className="timeline">
                    <div className="d-flex gap-3 mb-3">
                      <div className="bg-success rounded-circle d-flex align-items-center justify-content-center" style={{width: '24px', height: '24px', minWidth: '24px'}}>
                        <FaCheckCircle size={12} className="text-white" />
                      </div>
                      <div>
                        <div className="fw-medium">Order Confirmed</div>
                        <small className="text-muted">We've received your order and will start preparing it</small>
                      </div>
                    </div>
                    
                    <div className="d-flex gap-3 mb-3">
                      <div className="bg-light border rounded-circle d-flex align-items-center justify-content-center" style={{width: '24px', height: '24px', minWidth: '24px'}}>
                        <span className="small fw-bold">2</span>
                      </div>
                      <div>
                        <div className="fw-medium">Preparation Started</div>
                        <small className="text-muted">Our team will carefully prepare your items</small>
                      </div>
                    </div>
                    
                    <div className="d-flex gap-3 mb-3">
                      <div className="bg-light border rounded-circle d-flex align-items-center justify-content-center" style={{width: '24px', height: '24px', minWidth: '24px'}}>
                        <span className="small fw-bold">3</span>
                      </div>
                      <div>
                        <div className="fw-medium">Out for Delivery</div>
                        <small className="text-muted">Your order will be on its way on {getDeliveryDate()}</small>
                      </div>
                    </div>
                    
                    <div className="d-flex gap-3">
                      <div className="bg-light border rounded-circle d-flex align-items-center justify-content-center" style={{width: '24px', height: '24px', minWidth: '24px'}}>
                        <span className="small fw-bold">4</span>
                      </div>
                      <div>
                        <div className="fw-medium">Delivered</div>
                        <small className="text-muted">Enjoy your order! 🎉</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex flex-column gap-3">
                  <button 
                    onClick={shareOrderWhatsApp}
                    className="btn btn-success btn-lg d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaWhatsapp />
                    Share Order on WhatsApp
                  </button>
                  
                  <div className="row g-2">
                    <div className="col-6">
                      <button 
                        onClick={() => router.push('/')}
                        className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
                      >
                        <FaArrowLeft />
                        Continue Shopping
                      </button>
                    </div>
                    <div className="col-6">
                      <Link 
                        href="/contact" 
                        className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2 text-decoration-none"
                      >
                        <FaEnvelope />
                        Contact Us
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Support Information */}
                <div className="bg-primary bg-opacity-10 rounded-4 p-4 mt-4 text-center">
                  <h6 className="fw-bold mb-2">Need Help?</h6>
                  <p className="mb-2">
                    For any questions about your order, feel free to contact us:
                  </p>
                  <div className="d-flex justify-content-center gap-4">
                    <a href="tel:+911234567890" className="text-decoration-none fw-medium">
                      📞 +91 123 456 7890
                    </a>
                    <a href="mailto:support@mygiftflora.com" className="text-decoration-none fw-medium">
                      📧 support@mygiftflora.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default OrderSuccessPage;