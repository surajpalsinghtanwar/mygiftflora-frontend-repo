import React from 'react';
import TopHeader from './TopHeader';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout-wrapper">
      <TopHeader />
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
      
      <style jsx>{`
        .layout-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .main-content {
          flex: 1;
          position: relative;
        }

        /* Global Layout Styles */
        :global(body) {
          margin: 0;
          padding: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          line-height: 1.6;
          color: #333;
          background: #fff;
        }

        :global(*) {
          box-sizing: border-box;
        }

        :global(a) {
          color: inherit;
          text-decoration: none;
        }

        :global(.container) {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 15px;
        }

        :global(.btn) {
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }

        :global(.btn-primary) {
          background: linear-gradient(135deg, #ff6b6b, #ee5a52);
          color: white;
        }

        :global(.btn-primary:hover) {
          background: linear-gradient(135deg, #ee5a52, #ff6b6b);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
        }

        :global(.btn-secondary) {
          background: #6c757d;
          color: white;
        }

        :global(.btn-secondary:hover) {
          background: #5a6268;
          transform: translateY(-2px);
        }

        :global(.btn-outline) {
          background: transparent;
          border: 2px solid #ff6b6b;
          color: #ff6b6b;
        }

        :global(.btn-outline:hover) {
          background: #ff6b6b;
          color: white;
        }

        /* Utility Classes */
        :global(.text-center) {
          text-align: center;
        }

        :global(.text-left) {
          text-align: left;
        }

        :global(.text-right) {
          text-align: right;
        }

        :global(.mb-0) { margin-bottom: 0; }
        :global(.mb-1) { margin-bottom: 0.25rem; }
        :global(.mb-2) { margin-bottom: 0.5rem; }
        :global(.mb-3) { margin-bottom: 1rem; }
        :global(.mb-4) { margin-bottom: 1.5rem; }
        :global(.mb-5) { margin-bottom: 3rem; }

        :global(.mt-0) { margin-top: 0; }
        :global(.mt-1) { margin-top: 0.25rem; }
        :global(.mt-2) { margin-top: 0.5rem; }
        :global(.mt-3) { margin-top: 1rem; }
        :global(.mt-4) { margin-top: 1.5rem; }
        :global(.mt-5) { margin-top: 3rem; }

        :global(.p-0) { padding: 0; }
        :global(.p-1) { padding: 0.25rem; }
        :global(.p-2) { padding: 0.5rem; }
        :global(.p-3) { padding: 1rem; }
        :global(.p-4) { padding: 1.5rem; }
        :global(.p-5) { padding: 3rem; }

        /* Responsive Grid */
        :global(.row) {
          display: flex;
          flex-wrap: wrap;
          margin: 0 -15px;
        }

        :global(.col),
        :global([class*="col-"]) {
          padding: 0 15px;
          flex: 1;
        }

        :global(.col-1) { flex: 0 0 8.333333%; max-width: 8.333333%; }
        :global(.col-2) { flex: 0 0 16.666667%; max-width: 16.666667%; }
        :global(.col-3) { flex: 0 0 25%; max-width: 25%; }
        :global(.col-4) { flex: 0 0 33.333333%; max-width: 33.333333%; }
        :global(.col-5) { flex: 0 0 41.666667%; max-width: 41.666667%; }
        :global(.col-6) { flex: 0 0 50%; max-width: 50%; }
        :global(.col-7) { flex: 0 0 58.333333%; max-width: 58.333333%; }
        :global(.col-8) { flex: 0 0 66.666667%; max-width: 66.666667%; }
        :global(.col-9) { flex: 0 0 75%; max-width: 75%; }
        :global(.col-10) { flex: 0 0 83.333333%; max-width: 83.333333%; }
        :global(.col-11) { flex: 0 0 91.666667%; max-width: 91.666667%; }
        :global(.col-12) { flex: 0 0 100%; max-width: 100%; }

        @media (min-width: 768px) {
          :global(.col-md-1) { flex: 0 0 8.333333%; max-width: 8.333333%; }
          :global(.col-md-2) { flex: 0 0 16.666667%; max-width: 16.666667%; }
          :global(.col-md-3) { flex: 0 0 25%; max-width: 25%; }
          :global(.col-md-4) { flex: 0 0 33.333333%; max-width: 33.333333%; }
          :global(.col-md-5) { flex: 0 0 41.666667%; max-width: 41.666667%; }
          :global(.col-md-6) { flex: 0 0 50%; max-width: 50%; }
          :global(.col-md-7) { flex: 0 0 58.333333%; max-width: 58.333333%; }
          :global(.col-md-8) { flex: 0 0 66.666667%; max-width: 66.666667%; }
          :global(.col-md-9) { flex: 0 0 75%; max-width: 75%; }
          :global(.col-md-10) { flex: 0 0 83.333333%; max-width: 83.333333%; }
          :global(.col-md-11) { flex: 0 0 91.666667%; max-width: 91.666667%; }
          :global(.col-md-12) { flex: 0 0 100%; max-width: 100%; }
        }

        @media (min-width: 992px) {
          :global(.col-lg-1) { flex: 0 0 8.333333%; max-width: 8.333333%; }
          :global(.col-lg-2) { flex: 0 0 16.666667%; max-width: 16.666667%; }
          :global(.col-lg-3) { flex: 0 0 25%; max-width: 25%; }
          :global(.col-lg-4) { flex: 0 0 33.333333%; max-width: 33.333333%; }
          :global(.col-lg-5) { flex: 0 0 41.666667%; max-width: 41.666667%; }
          :global(.col-lg-6) { flex: 0 0 50%; max-width: 50%; }
          :global(.col-lg-7) { flex: 0 0 58.333333%; max-width: 58.333333%; }
          :global(.col-lg-8) { flex: 0 0 66.666667%; max-width: 66.666667%; }
          :global(.col-lg-9) { flex: 0 0 75%; max-width: 75%; }
          :global(.col-lg-10) { flex: 0 0 83.333333%; max-width: 83.333333%; }
          :global(.col-lg-11) { flex: 0 0 91.666667%; max-width: 91.666667%; }
          :global(.col-lg-12) { flex: 0 0 100%; max-width: 100%; }
        }

        /* Responsive Utilities */
        @media (max-width: 767px) {
          :global(.d-none-mobile) {
            display: none !important;
          }
        }

        @media (min-width: 768px) {
          :global(.d-none-desktop) {
            display: none !important;
          }
        }

        /* Animation Classes */
        :global(.fade-in) {
          animation: fadeIn 0.6s ease-in-out;
        }

        :global(.slide-up) {
          animation: slideUp 0.6s ease-out;
        }

        :global(.scale-in) {
          animation: scaleIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Loading States */
        :global(.loading) {
          position: relative;
          pointer-events: none;
        }

        :global(.loading::after) {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          margin: -10px 0 0 -10px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #ff6b6b;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Focus States for Accessibility */
        :global(*:focus) {
          outline: 2px solid #ff6b6b;
          outline-offset: 2px;
        }

        :global(button:focus),
        :global(a:focus),
        :global(input:focus),
        :global(select:focus),
        :global(textarea:focus) {
          outline: 2px solid #ff6b6b;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default Layout;