import { useState } from 'react';
import Link from 'next/link';
import { FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import type { MobileMenuProps } from './types';

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, navItems }) => {
  const [openCategoryIndex, setOpenCategoryIndex] = useState<number | null>(null);

  const handleCategoryClick = (index: number) => {
    setOpenCategoryIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <>
      <div 
        className={`position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-md-none ${
          isOpen ? '' : 'd-none'
        }`}
        style={{zIndex: 1040}}
        onClick={onClose}
      ></div>
      
      <div 
        className={`offcanvas offcanvas-start d-md-none ${isOpen ? 'show' : ''}`}
        style={{
          visibility: isOpen ? 'visible' : 'hidden',
          zIndex: 1050,
          width: '85%',
          maxWidth: '350px'
        }}
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title fw-bold text-dark">Menu</h5>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
        </div>

        <div className="offcanvas-body p-0">
          <div className="accordion accordion-flush" id="mobileMenuAccordion">
            {navItems.map((item, index) => (
              <div key={item.path || item.slug || item.label || index} className="accordion-item">
                {item.subcategories ? (
                  <div>
                    <h2 className="accordion-header">
                      <button 
                        className="accordion-button collapsed fw-medium text-dark"
                        type="button"
                        onClick={() => handleCategoryClick(index)}
                        aria-expanded={openCategoryIndex === index}
                      >
                        {item.label}
                      </button>
                    </h2>
                    <div className={`accordion-collapse collapse ${openCategoryIndex === index ? 'show' : ''}`}>
                      <div className="accordion-body bg-light p-0">
                        {item.subcategories.map((subCategory) => (
                          <div key={subCategory.path || subCategory.slug || subCategory.title} className="border-bottom">
                            <Link 
                              href={subCategory.path || (subCategory.slug ? `/products/${subCategory.slug}` : '#')}
                              onClick={onClose}
                              className="d-block fw-bold text-primary p-3 text-decoration-none"
                            >
                              {subCategory.title || subCategory.name}
                            </Link>
                            <div className="ps-3">
                              {subCategory.subSubcategories?.map(subSubCategory => (
                                <Link
                                  key={subSubCategory.path || subSubCategory.slug || subSubCategory.label}
                                  href={subSubCategory.path || (subSubCategory.slug ? `/products/${subSubCategory.slug}` : '#')}
                                  onClick={onClose}
                                  className="d-block text-dark text-decoration-none py-2 px-3 small hover-bg-light"
                                >
                                  {subSubCategory.label || subSubCategory.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.path || (item.slug ? `/products/${item.slug}` : '#')}
                    onClick={onClose}
                    className="d-block fw-medium text-dark text-decoration-none p-3 border-bottom"
                  >
                    {item.label || item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default MobileMenu;