import { useState } from 'react';
import { Link } from 'react-router-dom';
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
        className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={onClose}
      ></div>
      
      <div 
        className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-xl z-50 transform transition-transform lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="font-bold text-lg text-gray-800">Menu</h2>
          <button onClick={onClose} className="text-2xl text-gray-600" aria-label="Close menu">
            <FaTimes />
          </button>
        </div>

        <div className="h-[calc(100%-61px)] overflow-y-auto">
          <ul className="flex flex-col">
            {navItems.map((item, index) => (
              <li key={item.path} className="border-b border-gray-200">
                {item.subcategories ? (
                  <div>
                    <button 
                      onClick={() => handleCategoryClick(index)}
                      className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-gray-700"
                    >
                      <span>{item.label}</span>
                      {openCategoryIndex === index ? <FaMinus /> : <FaPlus />}
                    </button>
                    {openCategoryIndex === index && (
                      <div className="bg-gray-50">
                        {item.subcategories.map((subCategory) => (
                          <div key={subCategory.title} className="py-2 pl-4">
                            <Link 
                                to={subCategory.path}
                                onClick={onClose}
                                className="block px-4 py-2 font-bold text-gray-600 hover:text-orange-500"
                            >
                              {subCategory.title}
                            </Link>
                            <ul>
                              {subCategory.subSubcategories.map(subSubCategory => (
                                <li key={subSubCategory.path}>
                                  <Link
                                    to={subSubCategory.path}
                                    onClick={onClose}
                                    className="block pl-8 pr-4 py-2 text-gray-500 hover:bg-gray-200"
                                  >
                                    {subSubCategory.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (

                  <Link
                    to={item.path}
                    onClick={onClose}
                    className="block px-4 py-3 font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
export default MobileMenu;