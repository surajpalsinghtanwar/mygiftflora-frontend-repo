export interface Subcategory {
  id: string;
  name: string;
  slug?: string;
  category_id: string;
  icon?: string;
  status: boolean;
  banner?: string;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    slug?: string;
    icon?: string;
    banner?: string;
    meta_title?: string;
    meta_description?: string;
    status: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface CreateSubcategoryDto {
  name: string;
  category_id: string;
  icon?: string;
  banner?: File;
  meta_title?: string;
  meta_description?: string;
}

export interface UpdateSubcategoryDto {
  name?: string;
  category_id?: string;
  icon?: string;
  banner?: File;
  meta_title?: string;
  meta_description?: string;
}

export interface SubcategoryState {
  subcategories: Subcategory[];
  loading: boolean;
  error: string | null;
  currentSubcategory: Subcategory | null;
  success: boolean;
  message: string | null;
}
