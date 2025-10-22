import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaSearch,
  FaUser,
  FaBars,
  FaMapMarkerAlt,
  FaSignInAlt,
} from 'react-icons/fa';
import type { MainHeaderProps } from './types';
import { CartFlyout } from '../../features/cart/CartFlyout';
import { WishlistIcon } from '../../features/wishlist/WishlistIcon';
import { CartIcon } from '../../features/cart/CartIcon';
import { useAppSelector } from '../../hooks/reduxHooks';

const MainHeader: React.FC<MainHeaderProps> = ({ onMenuToggle }) => {
  const [isCartOpen, setCartOpen] = useState(false);
  // Get the auth token from your Redux store
  const { token } = useAppSelector((state) => state.auth); 
  const isLoggedIn = !!token;

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          {/* Hamburger Menu Icon */}
          <button onClick={onMenuToggle} className="lg:hidden text-2xl text-gray-600" aria-label="Open menu">
            <FaBars />
          </button>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <div className="text-2xl font-bold text-blue-600">The Murphy</div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:block flex-grow max-w-xl">
            <div className="relative">
              <input type="search" placeholder="Search Products..." className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <button className="absolute right-0 top-0 h-full px-4 bg-orange-500 text-white rounded-r-md hover:bg-orange-600" aria-label="Search">
                <FaSearch />
              </button>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4 md:gap-6 text-sm">
            <Link to="/tracking" className="hidden md:flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors">
              <FaMapMarkerAlt className="text-xl" />
              <span className="hidden xl:block">Track Order</span>
            </Link>
            {/* <Link to="/account" className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors">
              <FaUser className="text-xl" />
              <span className="hidden xl:block">Account</span>
            </Link> */}
              <Link 
              to={isLoggedIn ? "/account" : "/login"} 
              className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors"
            >
              {isLoggedIn ? <FaUser className="text-xl" /> : <FaSignInAlt className="text-xl" />}
              <span className="hidden xl:block">
                {isLoggedIn ? "Account" : "Login / Sign Up"}
              </span>
            </Link>
            <WishlistIcon />
           <CartIcon onClick={() => setCartOpen(true)} />

          </div>
        </div>

        {/* Mobile Search Bar*/}
        <div className="mt-4 lg:hidden">
          <div className="relative">
            <input type="search" placeholder="Search Products..." className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
            <button className="absolute right-0 top-0 h-full px-4 bg-orange-500 text-white rounded-r-md hover:bg-orange-600" aria-label="Search">
              <FaSearch />
            </button>
          </div>
        </div>
      </div>
      
      {/* Render the Cart Flyout */}
      <CartFlyout isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default MainHeader;