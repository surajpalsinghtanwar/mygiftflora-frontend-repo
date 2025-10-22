import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout-wrapper">
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
      `}</style>
    </div>
  );
};

export default Layout;