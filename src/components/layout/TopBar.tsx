import React from 'react';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPinterest,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa';

const TopBar: React.FC = () => (
  <div className="bg-primary text-white py-2">
    <div className="container-fluid">
      <div className="row align-items-center">
        <div className="col-lg-8">
          <p className="mb-0 fw-medium small">🎉 FREE DELIVERY on orders above ₹999 | Same Day Delivery Available</p>
        </div>
        <div className="col-lg-4 d-none d-lg-block">
          <div className="d-flex align-items-center justify-content-end gap-3">
            <div className="d-flex align-items-center gap-3">
              <a href="tel:+911234567890" className="text-white text-decoration-none d-flex align-items-center gap-1" style={{fontSize: '0.875rem'}}>
                <FaPhone />
                <span>+91 12345 67890</span>
              </a>
              <a href="mailto:support@mygiftflora.com" className="text-white text-decoration-none d-flex align-items-center gap-1" style={{fontSize: '0.875rem'}}>
                <FaEnvelope />
                <span>support@mygiftflora.com</span>
              </a>
            </div>
            <div className="d-flex align-items-center gap-2 ms-3 ps-3" style={{borderLeft: '1px solid rgba(255,255,255,0.3)'}}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white text-decoration-none">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white text-decoration-none">
                <FaInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-white text-decoration-none">
                <FaTwitter />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="text-white text-decoration-none">
                <FaPinterest />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TopBar;