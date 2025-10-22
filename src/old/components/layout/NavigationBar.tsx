import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import type { NavItem } from './types';

interface NavigationBarProps {
  navItems: NavItem[];
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ navItems }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  const handleDropdownClick = () => {
    setActiveIndex(null);
  };

  return (
    <nav className="hidden lg:flex bg-white shadow-sm" onMouseLeave={handleMouseLeave}>
      <div className="max-w-7xl mx-auto relative">
        <ul className="flex items-center justify-center gap-6 xl:gap-8 py-3">
          {navItems.map((item, index) => (
            <li key={item.path} onMouseEnter={() => handleMouseEnter(index)}>
              <Link
                to={item.path}
                className="text-gray-800 font-semibold uppercase text-sm hover:text-orange-500 transition-colors tracking-wider flex items-center gap-1.5"
              >
                {item.label}
                {item.subcategories && <FaChevronDown className="h-2.5 w-2.5" />}
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Render dropdown if an item is active and HAS subcategories */}
        {activeIndex !== null && navItems[activeIndex]?.subcategories && (
          <div 
            onClick={handleDropdownClick}
            className="absolute top-full left-1/2 -translate-x-1/2 w-screen max-w-7xl bg-white shadow-xl border-t border-gray-200 p-8 transition-opacity duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {navItems[activeIndex].subcategories?.map((subCategory) => (
                <div key={subCategory.title}>
                  <Link to={subCategory.path}>
                    <h3 className="font-bold text-gray-800 uppercase text-sm border-b pb-2 mb-4 hover:text-orange-500 transition-all">
                      {subCategory.title}
                    </h3>
                  </Link>
                  
                  <ul>
                    {subCategory.subSubcategories.map((subSubCategory) => (
                      <li key={subSubCategory.path}>
                        <Link 
                          to={subSubCategory.path}
                          className="block py-1.5 text-gray-500 hover:text-orange-500 hover:pl-2 transition-all duration-200"
                        >
                          {subSubCategory.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;