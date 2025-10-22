export interface MainHeaderProps {
  onMenuToggle: () => void;
}

export interface NavigationBarProps {
  navItems: NavItem[];
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export type NavLink = {
  label: string;
  path: string;
};

// Represents a final, clickable link (e.g., "3 Seater Sofa")
export interface SubSubcategory {
  // label displayed in mobile/local JSON
  label?: string;
  // alternate name key used in some APIs
  name?: string;
  // path to link to (preferred)
  path?: string;
  // optional slug (category-like)
  slug?: string;
}

// Represents a column in the dropdown (e.g., "Sofa Sets")
export interface SubCategory {
  // title used in local JSON
  title?: string;
  // fallback name/label
  name?: string;
  // path to the subcategory
  path?: string;
  // optional slug
  slug?: string;
  subSubcategories?: SubSubcategory[];
}

// Represents a top-level item in the navbar (e.g., "Sofa")
export interface NavItem {
  // display name
  name?: string;
  // alternate label key from JSON
  label?: string;
  // optional slug used for category -> /products/:slug
  slug?: string;
  // preferred link path
  path?: string;
  subcategories?: SubCategory[];
}