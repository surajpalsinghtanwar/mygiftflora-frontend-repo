import { useState, useCallback, memo } from 'react';
import Link from 'next/link';
import { FaChevronDown } from 'react-icons/fa';
import type { NavItem } from './types';

interface NavigationBarProps {
  navItems: NavItem[];
}

export const NavigationBar: React.FC<NavigationBarProps> = memo(({ navItems }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleMouseEnter = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const handleDropdownClick = useCallback(() => {
    setActiveIndex(null);
  }, []);

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-white border-bottom" onMouseLeave={handleMouseLeave}>
      <div className="container-fluid">
        <div className="navbar-nav mx-auto">
          <div className="d-flex justify-content-center gap-4">
            {navItems.map((item, index) => (
              <div key={item.slug || item.path || index} onMouseEnter={() => handleMouseEnter(index)} className="nav-item dropdown position-static">
                <Link
                  href={item.path ? item.path : (item.slug ? `/products/${item.slug}` : '#')}
                  className={`nav-link fw-medium text-uppercase px-3 py-3 d-flex align-items-center gap-1 position-relative text-dark nav-link-custom`}
                  style={{fontSize: '0.875rem', letterSpacing: '0.5px', transition: 'all 0.3s ease'}}
                  prefetch={false}
                >
                  {item.name || item.label}
                  {item.subcategories && (
                    <FaChevronDown 
                      className={`ms-1 ${
                        activeIndex === index ? 'rotate-180' : ''
                      }`}
                      style={{fontSize: '0.75rem', transition: 'transform 0.3s ease'}} 
                    />
                  )}
                  {/* Clean hover indicator */}
                  {activeIndex === index && (
                    <span 
                      className="position-absolute bottom-0 start-50 translate-middle-x bg-dark"
                      style={{width: '30px', height: '3px', borderRadius: '2px'}}
                    ></span>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
        
        {/* Enhanced Mega Menu Dropdown */}
        {activeIndex !== null && navItems[activeIndex]?.subcategories && (
          <div 
            onClick={handleDropdownClick}
            className="position-absolute w-100 bg-white shadow-lg border-top"
            style={{ 
              top: '100%', 
              left: '0', 
              right: '0', 
              zIndex: 1050,
              borderTop: '3px solid #212529'
            }}
          >
            <div className="container-fluid py-4">
              <div className="row">
                {navItems[activeIndex].subcategories?.map((subCategory, subIndex) => (
                  <div key={subCategory.slug || subCategory.path || subCategory.name || subIndex} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <div className="h-100">
                      <Link 
                        href={subCategory.path || (subCategory.slug ? `/products/${subCategory.slug}` : '#')}
                        className="text-decoration-none d-block subcategory-title-link"
                        prefetch={false}
                      >
                        <h6 className="fw-bold text-dark mb-3 pb-2 border-bottom border-light category-header"
                            style={{fontSize: '1rem'}}>
                          {subCategory.name || subCategory.title}
                        </h6>
                      </Link>
                      <ul className="list-unstyled">
                        {subCategory.subSubcategories?.map((subSubCategory) => (
                          <li key={subSubCategory.slug || subSubCategory.path || subSubCategory.name} className="mb-1">
                            <Link
                              href={subSubCategory.path || (subSubCategory.slug ? `/products/${subSubCategory.slug}` : '#')}
                              className="text-decoration-none text-muted d-block py-2 px-3 rounded-2 subcategory-link-clean"
                              style={{
                                fontSize: '0.9rem', 
                                fontWeight: '500', 
                                lineHeight: '1.4',
                                transition: 'all 0.2s ease'
                              }}
                              prefetch={false}
                            >
                              {subSubCategory.name || subSubCategory.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
});

NavigationBar.displayName = 'NavigationBar';

export default NavigationBar;