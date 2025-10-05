export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  banner: string;
  meta_title?: string;
  meta_description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}


export interface CreateCategoryDto {
  name: string;
  icon: string;
  banner?: File;
  meta_title?: string;
  meta_description?: string;
}


export interface UpdateCategoryDto {
  name?: string;
  icon?: string;
  banner?: File;
  meta_title?: string;
  meta_description?: string;
  status?: 'active' | 'inactive';
}

export interface CategoryState {
  categories: Category[];
  category: Category | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
}
