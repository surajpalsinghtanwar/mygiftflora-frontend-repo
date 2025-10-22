import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FaSearch,
  FaUser,
  FaBars,
  FaMapMarkerAlt,
  FaSignInAlt,
  FaHeart,
} from 'react-icons/fa';
import type { MainHeaderProps } from './types';
import { WishlistIcon } from '../wishlist/WishlistIcon';
import CartButton from '../CartButton';

const MainHeader: React.FC<MainHeaderProps> = ({ onMenuToggle }) => {
  const router = useRouter();
  // For now, hardcode login state - replace with actual auth logic later
  const isLoggedIn = false;

  return (
    <>
      <div className="bg-dark text-white border-bottom border-secondary shadow-sm py-3">
        <div className="container-fluid">
          <div className="row align-items-center">
            {/* Hamburger Menu Icon */}
            <div className="col-auto d-md-none">
              <button onClick={onMenuToggle} className="btn btn-link text-white p-0" aria-label="Open menu">
                <FaBars size={20} />
              </button>
            </div>

            {/* Logo */}
            <div className="col-auto">
              <Link href="/" className="text-decoration-none">
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded-circle bg-white d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                    <span className="text-dark fw-bold">MG</span>
                  </div>
                  <div className="d-none d-sm-block">
                    <div className="h4 mb-0 fw-bold text-white">
                      MyGiftFlora
                    </div>
                    <div className="small text-light">Cakes, Flowers & Gifts</div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="col d-none d-md-block mx-3">
              <div className="position-relative" style={{maxWidth: '600px'}}>
                <input 
                  type="search" 
                  placeholder="Search for cakes, flowers, gifts..." 
                  className="form-control form-control-lg border-0 bg-white" 
                  style={{paddingRight: '50px'}}
                />
                <button className="btn btn-primary position-absolute top-50 translate-middle-y end-0 me-1" style={{zIndex: 5}} aria-label="Search">
                  <FaSearch />
                </button>
              </div>
            </div>

            {/* User Actions */}
            <div className="col-auto">
              <div className="d-flex align-items-center gap-2">
                <Link href="/track-order" className="btn btn-link text-white text-decoration-none d-none d-lg-flex align-items-center gap-2 p-2">
                  <FaMapMarkerAlt />
                  <span className="d-none d-xl-block">Track Order</span>
                </Link>
                
                <Link 
                  href={isLoggedIn ? "/account" : "/login"} 
                  className="btn btn-link text-white text-decoration-none d-flex align-items-center gap-2 p-2"
                >
                  {isLoggedIn ? <FaUser /> : <FaSignInAlt />}
                  <span className="d-none d-xl-block">
                    {isLoggedIn ? "Account" : "Login"}
                  </span>
                </Link>
                
                <WishlistIcon />
                <CartButton />
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="row mt-3 d-md-none">
            <div className="col">
              <div className="position-relative">
                <input 
                  type="search" 
                  placeholder="Search for cakes, flowers, gifts..." 
                  className="form-control bg-white border-0" 
                  style={{paddingRight: '50px'}}
                />
                <button className="btn btn-primary position-absolute top-50 translate-middle-y end-0 me-1" aria-label="Search">
                  <FaSearch />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainHeader;