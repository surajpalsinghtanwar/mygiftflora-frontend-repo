import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';

const Footer: React.FC = () => (
  <footer className="bg-dark text-light py-5 mt-5">
    <div className="container">
      <div className="row g-4">
        {/* Company Info */}
        <div className="col-lg-4 col-md-6">
          <div className="mb-4">
            <h5 className="fw-bold mb-3">MyGiftFlora</h5>
            <p className="text-light opacity-75 mb-3">
              Your trusted partner for fresh flowers, delicious cakes, and thoughtful gifts. 
              Making every occasion special with our premium quality products and timely delivery.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-light opacity-75 hover-opacity-100">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-light opacity-75 hover-opacity-100">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-light opacity-75 hover-opacity-100">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-light opacity-75 hover-opacity-100">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="col-lg-2 col-md-6">
          <h6 className="fw-bold mb-3">Quick Links</h6>
          <ul className="list-unstyled">
            <li className="mb-2">
              <Link href="/products" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                All Products
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/products/cakes" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                Cakes
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/products/flowers" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                Flowers
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/products/gifts" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                Gifts
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/track-order" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                Track Order
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div className="col-lg-2 col-md-6">
          <h6 className="fw-bold mb-3">Customer Care</h6>
          <ul className="list-unstyled">
            <li className="mb-2">
              <Link href="/about" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                About Us
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/contact" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                Contact Us
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/faq" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                FAQ
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/shipping" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                Shipping Info
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/returns" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                Return Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="col-lg-4 col-md-6">
          <h6 className="fw-bold mb-3">Contact Info</h6>
          <div className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <FaPhone className="me-2 text-primary" />
              <span className="text-light opacity-75">+91 9876543210</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <FaEnvelope className="me-2 text-primary" />
              <span className="text-light opacity-75">support@mygiftflora.com</span>
            </div>
            <div className="d-flex align-items-start mb-3">
              <FaMapMarkerAlt className="me-2 mt-1 text-primary" />
              <span className="text-light opacity-75">
                123 Business Street, City Center,<br />
                New Delhi - 110001, India
              </span>
            </div>
          </div>
          
          {/* Newsletter */}
          <h6 className="fw-bold mb-3">Newsletter</h6>
          <div className="input-group">
            <input 
              type="email" 
              className="form-control bg-secondary border-0 text-light" 
              placeholder="Your email address"
            />
            <button className="btn btn-primary" type="button">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <hr className="my-4 opacity-25" />

      {/* Bottom Footer */}
      <div className="row align-items-center">
        <div className="col-md-6">
          <p className="mb-0 text-light opacity-75">
            &copy; {new Date().getFullYear()} MyGiftFlora. All rights reserved.
          </p>
        </div>
        <div className="col-md-6 text-md-end">
          <p className="mb-0 text-light opacity-75">
            Made with <FaHeart className="text-danger mx-1" /> by{' '}
            <a href="https://jhajiconsultancy.in" className="text-primary text-decoration-none">
              Jhaji Consultancy
            </a>
          </p>
        </div>
      </div>
    </div>

    <style jsx>{`
      .hover-opacity-100:hover {
        opacity: 1 !important;
        transition: opacity 0.3s ease;
      }
    `}</style>
  </footer>
);

export default Footer;