
export interface MainHeaderProps {
  onMenuToggle: () => void;
}

export interface NavigationBarProps {
  navItems: NavItem[];
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[]; // Using the updated NavItem type
}
export type NavLink = {
  label: string;
  path: string;
};

// Represents a final, clickable link (e.g., "3 Seater Sofa")
export interface SubSubcategory {
  label: string;
  path: string;
}

// Represents a column in the dropdown (e.g., "Sofa Sets")
export interface SubCategory {
  title: string;
  path: string;
  subSubcategories: SubSubcategory[];
}

// Represents a top-level item in the navbar (e.g., "Sofa")
export interface NavItem {
  label: string;
  path: string;
  subcategories?: SubCategory[]; // This was previously `megaMenu?`
}

