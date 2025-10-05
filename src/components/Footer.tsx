import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <>
      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="newsletter-content">
                <h3>Stay Updated with Our Latest Offers</h3>
                <p>Get exclusive deals, new arrivals, and special discounts delivered to your inbox.</p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="newsletter-form">
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control newsletter-input"
                    placeholder="Enter your email address"
                  />
                  <button className="btn newsletter-btn" type="button">
                    Subscribe
                    <i className="fas fa-paper-plane ms-2"></i>
                  </button>
                </div>
                <div className="newsletter-features">
                  <span className="feature-item">
                    <i className="fas fa-check"></i>
                    Weekly Deals
                  </span>
                  <span className="feature-item">
                    <i className="fas fa-check"></i>
                    Exclusive Offers
                  </span>
                  <span className="feature-item">
                    <i className="fas fa-check"></i>
                    No Spam
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="main-footer">
        <div className="container">
          <div className="row">
            {/* Company Info */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="footer-section">
                <div className="footer-logo">
                  <h4 className="logo-text">GiftStore</h4>
                  <p className="company-tagline">Making Every Moment Special</p>
                </div>
                <p className="company-description">
                  We are your trusted partner for premium gifts, fresh flowers, delicious cakes, 
                  and memorable experiences. Delivering happiness since 2010.
                </p>
                <div className="contact-info">
                  <div className="contact-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>123 Gift Street, New York, NY 10001</span>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-phone"></i>
                    <span>+1-800-123-4567</span>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <span>support@giftstore.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6 mb-4">
              <div className="footer-section">
                <h5 className="footer-title">Quick Links</h5>
                <ul className="footer-links">
                  <li><Link href="/about">About Us</Link></li>
                  <li><Link href="/contact">Contact Us</Link></li>
                  <li><Link href="/careers">Careers</Link></li>
                  <li><Link href="/blog">Blog</Link></li>
                  <li><Link href="/press">Press</Link></li>
                  <li><Link href="/affiliate">Affiliate Program</Link></li>
                </ul>
              </div>
            </div>

            {/* Categories */}
            <div className="col-lg-2 col-md-6 mb-4">
              <div className="footer-section">
                <h5 className="footer-title">Categories</h5>
                <ul className="footer-links">
                  <li><Link href="/cakes">Birthday Cakes</Link></li>
                  <li><Link href="/flowers">Fresh Flowers</Link></li>
                  <li><Link href="/gifts">Premium Gifts</Link></li>
                  <li><Link href="/chocolates">Chocolates</Link></li>
                  <li><Link href="/plants">Plants</Link></li>
                  <li><Link href="/personalized">Personalized</Link></li>
                </ul>
              </div>
            </div>

            {/* Customer Service */}
            <div className="col-lg-2 col-md-6 mb-4">
              <div className="footer-section">
                <h5 className="footer-title">Customer Service</h5>
                <ul className="footer-links">
                  <li><Link href="/help">Help Center</Link></li>
                  <li><Link href="/track-order">Track Your Order</Link></li>
                  <li><Link href="/returns">Returns & Refunds</Link></li>
                  <li><Link href="/shipping">Shipping Info</Link></li>
                  <li><Link href="/size-guide">Size Guide</Link></li>
                  <li><Link href="/care-guide">Care Instructions</Link></li>
                </ul>
              </div>
            </div>

            {/* Social & Apps */}
            <div className="col-lg-2 col-md-6 mb-4">
              <div className="footer-section">
                <h5 className="footer-title">Connect With Us</h5>
                <div className="social-links">
                  <a href="#" className="social-link facebook">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="social-link twitter">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="social-link instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="social-link youtube">
                    <i className="fab fa-youtube"></i>
                  </a>
                  <a href="#" className="social-link pinterest">
                    <i className="fab fa-pinterest"></i>
                  </a>
                </div>
                
                <div className="app-downloads">
                  <h6>Download Our App</h6>
                  <div className="app-buttons">
                    <a href="#" className="app-button">
                      <img src="/app-store.png" alt="Download on App Store" />
                    </a>
                    <a href="#" className="app-button">
                      <img src="/google-play.png" alt="Get it on Google Play" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="trust-section">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <div className="trust-badges">
                  <div className="trust-item">
                    <i className="fas fa-shield-alt"></i>
                    <div className="trust-content">
                      <h6>Secure Payment</h6>
                      <span>256-bit SSL Encryption</span>
                    </div>
                  </div>
                  <div className="trust-item">
                    <i className="fas fa-truck"></i>
                    <div className="trust-content">
                      <h6>Free Shipping</h6>
                      <span>On orders over $50</span>
                    </div>
                  </div>
                  <div className="trust-item">
                    <i className="fas fa-undo"></i>
                    <div className="trust-content">
                      <h6>Easy Returns</h6>
                      <span>30-day return policy</span>
                    </div>
                  </div>
                  <div className="trust-item">
                    <i className="fas fa-headset"></i>
                    <div className="trust-content">
                      <h6>24/7 Support</h6>
                      <span>Always here to help</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="payment-methods">
                  <h6>We Accept</h6>
                  <div className="payment-icons">
                    <img src="/visa.png" alt="Visa" />
                    <img src="/mastercard.png" alt="Mastercard" />
                    <img src="/amex.png" alt="American Express" />
                    <img src="/paypal.png" alt="PayPal" />
                    <img src="/apple-pay.png" alt="Apple Pay" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Footer */}
      <div className="bottom-footer">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="copyright">
                <p>&copy; 2024 GiftStore. All rights reserved. Made with ❤️ for special moments.</p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="footer-bottom-links">
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms of Service</Link>
                <Link href="/cookies">Cookie Policy</Link>
                <Link href="/sitemap">Sitemap</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Newsletter Section */
        .newsletter-section {
          background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%);
          padding: 60px 0;
          position: relative;
          overflow: hidden;
        }

        .newsletter-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('/newsletter-pattern.png') repeat;
          opacity: 0.1;
        }

        .newsletter-content {
          position: relative;
          z-index: 2;
        }

        .newsletter-content h3 {
          color: white;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .newsletter-content p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          margin-bottom: 0;
        }

        .newsletter-form {
          position: relative;
          z-index: 2;
        }

        .newsletter-input {
          border: none;
          padding: 15px 20px;
          font-size: 16px;
          border-radius: 50px 0 0 50px;
          background: white;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .newsletter-input:focus {
          outline: none;
          box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        }

        .newsletter-btn {
          background: #1a1a1a;
          border: none;
          color: white;
          padding: 15px 30px;
          font-weight: 600;
          border-radius: 0 50px 50px 0;
          transition: all 0.3s ease;
        }

        .newsletter-btn:hover {
          background: #333;
          transform: translateY(-2px);
        }

        .newsletter-features {
          display: flex;
          gap: 20px;
          margin-top: 15px;
        }

        .feature-item {
          color: white;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .feature-item i {
          color: #fff;
          font-size: 12px;
        }

        /* Main Footer */
        .main-footer {
          background: #1a1a1a;
          color: #ccc;
          padding: 60px 0 40px;
          position: relative;
        }

        .footer-section {
          height: 100%;
        }

        .footer-logo .logo-text {
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }

        .company-tagline {
          color: #ff6b6b;
          font-style: italic;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .company-description {
          color: #999;
          line-height: 1.6;
          margin-bottom: 25px;
          font-size: 14px;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #ccc;
          font-size: 14px;
        }

        .contact-item i {
          color: #ff6b6b;
          width: 16px;
          font-size: 14px;
        }

        .footer-title {
          color: white;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 10px;
        }

        .footer-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30px;
          height: 2px;
          background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 10px;
        }

        .footer-links a {
          color: #999;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .footer-links a:hover {
          color: #ff6b6b;
          padding-left: 8px;
        }

        .social-links {
          display: flex;
          gap: 12px;
          margin-bottom: 25px;
        }

        .social-link {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: white;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .social-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          transform: scale(0);
          transition: transform 0.3s ease;
        }

        .social-link:hover::before {
          transform: scale(1);
        }

        .social-link:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        .facebook { background: #3b5998; }
        .twitter { background: #1da1f2; }
        .instagram { background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); }
        .youtube { background: #ff0000; }
        .pinterest { background: #bd081c; }

        .app-downloads h6 {
          color: white;
          font-size: 14px;
          margin-bottom: 15px;
          font-weight: 600;
        }

        .app-buttons {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .app-button img {
          height: 35px;
          width: auto;
          transition: transform 0.3s ease;
        }

        .app-button:hover img {
          transform: scale(1.05);
        }

        /* Trust Section */
        .trust-section {
          border-top: 1px solid #333;
          padding-top: 30px;
          margin-top: 20px;
        }

        .trust-badges {
          display: flex;
          gap: 30px;
          flex-wrap: wrap;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .trust-item i {
          color: #ff6b6b;
          font-size: 24px;
        }

        .trust-content h6 {
          color: white;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .trust-content span {
          color: #999;
          font-size: 12px;
        }

        .payment-methods h6 {
          color: white;
          font-size: 14px;
          margin-bottom: 15px;
          font-weight: 600;
        }

        .payment-icons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .payment-icons img {
          height: 25px;
          width: auto;
          background: white;
          padding: 4px 8px;
          border-radius: 4px;
          transition: transform 0.3s ease;
        }

        .payment-icons img:hover {
          transform: scale(1.1);
        }

        /* Bottom Footer */
        .bottom-footer {
          background: #111;
          border-top: 1px solid #333;
          padding: 20px 0;
        }

        .copyright p {
          color: #999;
          margin: 0;
          font-size: 14px;
        }

        .footer-bottom-links {
          display: flex;
          gap: 20px;
          justify-content: flex-end;
        }

        .footer-bottom-links a {
          color: #999;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s ease;
        }

        .footer-bottom-links a:hover {
          color: #ff6b6b;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .newsletter-section {
            padding: 40px 0;
          }

          .newsletter-content h3 {
            font-size: 22px;
            margin-bottom: 20px;
          }

          .newsletter-features {
            flex-direction: column;
            gap: 8px;
          }

          .main-footer {
            padding: 40px 0 30px;
          }

          .trust-badges {
            gap: 20px;
            justify-content: center;
          }

          .trust-item {
            flex-direction: column;
            text-align: center;
            gap: 8px;
          }

          .footer-bottom-links {
            justify-content: center;
            margin-top: 15px;
            flex-wrap: wrap;
            gap: 15px;
          }

          .copyright {
            text-align: center;
          }

          .payment-methods {
            text-align: center;
            margin-top: 20px;
          }

          .social-links {
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default Footer;