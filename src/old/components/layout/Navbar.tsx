import { useEffect, useState } from 'react';
import type { NavItem } from './types'; 
import TopBar from './TopBar';
import MainHeader from './MainHeader';
import NavigationBar from './NavigationBar';
import MobileMenu from './MobileMenu';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  
  useEffect(() => {
    fetch('/data/navigation.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: NavItem[]) => {
        console.log("Fetched navigation data:", data);
        setNavItems(data);
      })
      .catch((error) => {
        console.error('Error fetching navigation data:', error);
      });
  }, []); 
  

  const handleMenuToggle = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleMenuClose = (): void => {
    setIsMenuOpen(false);
  }

  return (
      <header className="w-full bg-white shadow-md sticky top-0 z-30">
        <TopBar />
        <MainHeader onMenuToggle={handleMenuToggle} />
        {navItems.length > 0 && <NavigationBar navItems={navItems} />}
        <MobileMenu isOpen={isMenuOpen} onClose={handleMenuClose} navItems={navItems} />
      </header>
  );
};

export default Navbar;