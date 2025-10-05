import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import headerData from '../data/headerData.json';
import navigationData from '../data/navigationData.json';

interface HeaderData {
  success: boolean;
  data: {
    brand: {
      name: string;
      tagline: string;
      icon: string;
    };
    location: {
      defaultCity: string;
      defaultZip: string;
      deliverText: string;
    };
    search: {
      placeholder: string;
      popularSearches: string[];
    };
    delivery: {
      options: Array<{
        icon: string;
        text: string;
      }>;
    };
  };
  message: string;
}

interface Subsubcategory {
  id: number;
  name: string;
  slug: string;
  url: string;
}

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  url: string;
  hasSubsubcategories: boolean;
  subsubcategories?: Subsubcategory[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  url: string;
  hasSubcategories: boolean;
  isSpecial: boolean;
  description: string;
  specialBadge?: string;
  subcategories?: Subcategory[];
  featured?: {
    image: string;
    title: string;
    description: string;
    price: string;
    url: string;
  };
}

interface NavigationData {
  success: boolean;
  data: Category[];
  message: string;
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [headerInfo, setHeaderInfo] = useState<HeaderData['data'] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Simulate API calls - in future replace with actual APIs
    const headerResponse: HeaderData = headerData as HeaderData;
    const navResponse: NavigationData = navigationData as NavigationData;
    
    if (headerResponse.success) {
      setHeaderInfo(headerResponse.data);
    }
    
    if (navResponse.success) {
      setCategories(navResponse.data);
    }
  }, []);

  if (!headerInfo) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Main Header */}
      <header className="main-header">
        <div className="container">
          <div className="header-wrapper">
            {/* Logo */}
            <div className="logo-section">
              <Link href="/" className="logo">
                <div className="logo-icon">{headerInfo.brand.icon}</div>
                <div className="logo-text">
                  <span className="brand-name">{headerInfo.brand.name}</span>
                  <span className="brand-tagline">{headerInfo.brand.tagline}</span>
                </div>
              </Link>
            </div>

            {/* Location Selector */}
            <div className="location-selector">
              <div className="location-icon">📍</div>
              <div className="location-info">
                <span className="deliver-to">{headerInfo.location.deliverText}</span>
                <span className="location-name">{headerInfo.location.defaultCity}, {headerInfo.location.defaultZip}</span>
              </div>
              <div className="change-location">Change</div>
            </div>

            {/* Search Bar */}
            <div className={`search-container ${isSearchOpen ? 'active' : ''}`}>
              <div className="search-wrapper">
                <input 
                  type="text" 
                  placeholder={headerInfo.search.placeholder}
                  className="search-input"
                  onFocus={() => setIsSearchOpen(true)}
                  onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                />
                <button className="search-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5 5.806 2 10.5 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
              <div className="search-suggestions">
                <div className="suggestion-category">
                  <h4>Popular Searches</h4>
                  <div className="suggestion-items">
                    {headerInfo.search.popularSearches.map((search, index) => (
                      <span key={index}>{search}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="header-actions">
              <div className="action-item">
                <Link href="/profile" className="profile-btn">
                  <div className="action-icon">👤</div>
                  <span>Account</span>
                </Link>
              </div>
              
              <div className="action-item">
                <Link href="/wishlist" className="wishlist-btn">
                  <div className="action-icon">❤️</div>
                  <span>Wishlist</span>
                  <div className="badge">3</div>
                </Link>
              </div>
              
              <div className="action-item">
                <Link href="/cart" className="cart-btn">
                  <div className="action-icon">🛒</div>
                  <span>Cart</span>
                  <div className="badge">2</div>
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                className="mobile-menu-toggle"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Menu */}
      <nav className={`main-navigation ${isMenuOpen ? 'mobile-open' : ''}`}>
        <div className="container">
          <div className="nav-wrapper">
            <div className="nav-menu">
              {categories.map((category) => (
                <div key={category.id} className={`nav-item ${category.hasSubcategories ? 'mega-menu-item' : ''} ${category.isSpecial ? 'special-offer' : ''}`}>
                  <Link href={category.url} className="nav-link">
                    <span className="nav-icon">{category.icon}</span>
                    <span>{category.name}</span>
                    {category.hasSubcategories && (
                      <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    )}
                    {category.specialBadge && (
                      <div className="offer-badge">{category.specialBadge}</div>
                    )}
                  </Link>
                  
                  {category.hasSubcategories && category.subcategories && (
                    <div className="mega-menu">
                      <div className="mega-menu-content">
                        {category.subcategories.map((subcategory) => (
                          <div key={subcategory.id} className="menu-column">
                            <h4>{subcategory.name}</h4>
                            <ul>
                              {subcategory.subsubcategories?.map((subsubcategory) => (
                                <li key={subsubcategory.id}>
                                  <Link href={subsubcategory.url}>{subsubcategory.name}</Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        
                        {category.featured && (
                          <div className="menu-featured">
                            <img src={category.featured.image} alt={category.featured.title} />
                            <h5>{category.featured.title}</h5>
                            <p>{category.featured.description}</p>
                            <span className="price">{category.featured.price}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Delivery Info */}
            <div className="delivery-info">
              {headerInfo.delivery.options.map((option, index) => (
                <div key={index} className="delivery-item">
                  <span className="delivery-icon">{option.icon}</span>
                  <span>{option.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <style jsx>{`
        /* Main Header */
        .main-header {
          background: white;
          box-shadow: 0 2px 20px rgba(0,0,0,0.08);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .header-wrapper {
          display: flex;
          align-items: center;
          padding: 15px 0;
          gap: 30px;
        }

        /* Logo */
        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: #333;
        }

        .logo-icon {
          font-size: 32px;
        }

        .brand-name {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: block;
          line-height: 1;
        }

        .brand-tagline {
          font-size: 11px;
          color: #666;
          font-weight: 400;
          display: block;
          margin-top: 2px;
        }

        /* Location Selector */
        .location-selector {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          min-width: 160px;
        }

        .location-selector:hover {
          border-color: #ff6b6b;
          box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.1);
        }

        .location-icon {
          font-size: 16px;
        }

        .location-info {
          flex: 1;
        }

        .deliver-to {
          font-size: 11px;
          color: #666;
          display: block;
          line-height: 1;
        }

        .location-name {
          font-size: 13px;
          font-weight: 600;
          color: #333;
          display: block;
          margin-top: 2px;
        }

        .change-location {
          font-size: 11px;
          color: #ff6b6b;
          font-weight: 500;
        }

        /* Search Bar */
        .search-container {
          flex: 1;
          max-width: 500px;
          position: relative;
        }

        .search-wrapper {
          display: flex;
          background: #f8f9fa;
          border: 2px solid #e0e0e0;
          border-radius: 25px;
          overflow: hidden;
          transition: all 0.3s;
        }

        .search-container.active .search-wrapper {
          border-color: #ff6b6b;
          box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.1);
        }

        .search-input {
          flex: 1;
          padding: 12px 20px;
          border: none;
          background: transparent;
          font-size: 14px;
          outline: none;
        }

        .search-input::placeholder {
          color: #999;
        }

        .search-btn {
          padding: 12px 20px;
          background: #ff6b6b;
          border: none;
          color: white;
          cursor: pointer;
          transition: background 0.3s;
        }

        .search-btn:hover {
          background: #ee5a52;
        }

        .search-suggestions {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          padding: 20px;
          margin-top: 5px;
          display: none;
          z-index: 1000;
        }

        .search-container.active .search-suggestions {
          display: block;
        }

        .suggestion-category h4 {
          margin: 0 0 12px 0;
          color: #333;
          font-size: 14px;
          font-weight: 600;
        }

        .suggestion-items {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .suggestion-items span {
          background: #f1f3f4;
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 12px;
          color: #555;
          cursor: pointer;
          transition: all 0.3s;
        }

        .suggestion-items span:hover {
          background: #ff6b6b;
          color: white;
        }

        /* Header Actions */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 25px;
        }

        .action-item {
          position: relative;
        }

        .action-item a {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          color: #333;
          transition: all 0.3s;
          padding: 8px;
          border-radius: 8px;
        }

        .action-item a:hover {
          color: #ff6b6b;
          background: rgba(255, 107, 107, 0.1);
        }

        .action-icon {
          font-size: 20px;
          margin-bottom: 4px;
        }

        .action-item span {
          font-size: 12px;
          font-weight: 500;
        }

        .badge {
          position: absolute;
          top: 5px;
          right: 5px;
          background: #ff6b6b;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 600;
        }

        /* Mobile Menu Toggle */
        .mobile-menu-toggle {
          display: none;
          flex-direction: column;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          gap: 3px;
        }

        .mobile-menu-toggle span {
          width: 20px;
          height: 2px;
          background: #333;
          transition: all 0.3s;
        }

        /* Navigation */
        .main-navigation {
          background: white;
          border-bottom: 1px solid #f0f0f0;
          position: relative;
        }

        .nav-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
        }

        .nav-menu {
          display: flex;
          align-items: center;
          gap: 35px;
        }

        .nav-item {
          position: relative;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #333;
          font-weight: 500;
          font-size: 14px;
          padding: 10px 0;
          transition: all 0.3s;
        }

        .nav-link:hover {
          color: #ff6b6b;
        }

        .nav-icon {
          font-size: 16px;
        }

        .dropdown-arrow {
          margin-left: 4px;
          transition: transform 0.3s;
        }

        .mega-menu-item:hover .dropdown-arrow {
          transform: rotate(180deg);
        }

        /* Special Offer Item */
        .special-offer .nav-link {
          background: linear-gradient(135deg, #ff6b6b, #ee5a52);
          color: white;
          padding: 10px 15px;
          border-radius: 20px;
          position: relative;
          overflow: hidden;
        }

        .special-offer .nav-link:hover {
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
        }

        .offer-badge {
          background: white;
          color: #ff6b6b;
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 9px;
          font-weight: 700;
          margin-left: 6px;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        /* Mega Menu */
        .mega-menu {
          position: absolute;
          top: 100%;
          left: -50px;
          background: white;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          border-radius: 12px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: all 0.3s;
          z-index: 1000;
          min-width: 600px;
          border: 1px solid #f0f0f0;
        }

        .mega-menu-item:hover .mega-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .mega-menu-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 30px;
          padding: 30px;
        }

        .menu-column h4 {
          color: #333;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #f0f0f0;
        }

        .menu-column ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .menu-column li {
          margin-bottom: 8px;
        }

        .menu-column a {
          color: #666;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.3s;
          display: block;
          padding: 4px 0;
          border-left: 3px solid transparent;
          padding-left: 10px;
        }

        .menu-column a:hover {
          color: #ff6b6b;
          border-left-color: #ff6b6b;
          padding-left: 15px;
        }

        /* Menu Featured */
        .menu-featured {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
        }

        .menu-featured img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 6px;
          margin-bottom: 12px;
        }

        .menu-featured h5 {
          color: #333;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .menu-featured p {
          color: #666;
          font-size: 13px;
          margin-bottom: 10px;
          line-height: 1.4;
        }

        .menu-featured .price {
          color: #ff6b6b;
          font-weight: 600;
          font-size: 14px;
        }

        /* Delivery Info */
        .delivery-info {
          display: flex;
          gap: 25px;
        }

        .delivery-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #666;
          font-weight: 500;
        }

        .delivery-icon {
          font-size: 14px;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .header-wrapper {
            gap: 15px;
            flex-wrap: wrap;
          }

          .location-selector {
            order: 3;
            flex: 1 1 100%;
            margin-top: 10px;
          }

          .search-container {
            order: 2;
            flex: 1;
            max-width: none;
          }

          .header-actions {
            gap: 15px;
          }

          .action-item span {
            display: none;
          }

          .mobile-menu-toggle {
            display: flex;
          }

          .main-navigation {
            display: none;
          }

          .main-navigation.mobile-open {
            display: block;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            z-index: 1000;
          }

          .nav-menu {
            flex-direction: column;
            gap: 0;
          }

          .nav-item {
            width: 100%;
            border-bottom: 1px solid #f0f0f0;
          }

          .nav-link {
            padding: 15px 20px;
            justify-content: space-between;
          }

          .delivery-info {
            justify-content: center;
            padding: 15px 0;
            border-top: 1px solid #f0f0f0;
          }

          .mega-menu {
            position: static;
            opacity: 1;
            visibility: visible;
            transform: none;
            box-shadow: none;
            border-radius: 0;
            min-width: auto;
            border: none;
            background: #f8f9fa;
          }

          .mega-menu-content {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
};

export default Header;