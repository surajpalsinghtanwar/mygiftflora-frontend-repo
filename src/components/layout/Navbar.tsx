import { useEffect, useState } from 'react';
import type { NavItem } from './types'; 
import TopBar from './TopBar';
import MainHeader from './MainHeader';
import NavigationBar from './NavigationBar';
import MobileMenu from './MobileMenu';
import { getApiUrl } from '@/utils/api';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  
  useEffect(() => {
    const fetchNavigationData = async () => {
      // Prefer local proxy endpoint to avoid direct backend calls from the browser
      const apiUrl = getApiUrl('/home/navigation');
      let fetched = null;
      try {
        const response = await fetch(apiUrl);
        if (response.ok) fetched = await response.json();
        else console.warn('/api/navigation returned non-OK status', response.status);
      } catch (err) {
        console.warn('Failed to fetch /api/navigation, will fallback to bundled navigation.json', err);
      }

      const items = Array.isArray(fetched) ? fetched : fetched.data || [];
      const normalized: NavItem[] = (items || []).map((it: any) => ({
        name: it.name || it.label || it.title || undefined,
        label: it.label || it.name || it.title || undefined,
        slug: it.slug,
        path: it.path || (it.slug ? `/products/${it.slug}` : undefined),
        subcategories: Array.isArray(it.subcategories) ? it.subcategories.map((sc:any) => ({
          title: sc.title || sc.name || sc.label,
          name: sc.name || sc.title || sc.label,
          path: sc.path || (sc.slug ? `/products/${sc.slug}` : undefined),
          slug: sc.slug,
          subSubcategories: Array.isArray(sc.subSubcategories) ? sc.subSubcategories.map((ssc:any) => ({
            label: ssc.label || ssc.name,
            name: ssc.name || ssc.label,
            path: ssc.path || (ssc.slug ? `/products/${ssc.slug}` : undefined),
            slug: ssc.slug
          })) : []
        })) : undefined
      }));
      setNavItems(normalized);
    };

    fetchNavigationData();
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