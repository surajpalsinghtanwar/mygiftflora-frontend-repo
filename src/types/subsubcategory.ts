

export interface SubSubcategory {
  id: string;
  name: string;
  category_id: string;
  subcategory_id: string;
  banner?: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
  };
  subcategory?: {
    id: string;
    name: string;
  };
}

export interface CreateSubSubcategoryDto {
  name: string;
  category_id: string;
  subcategory_id: string;
  banner?: File;
  status: boolean;
}

export interface UpdateSubSubcategoryDto {
  name?: string;
  category_id?: string;
  subcategory_id?: string;
  banner?: File;
  status?: boolean;
}

export interface SubSubcategoryState {
  subSubcategories: SubSubcategory[];
  loading: boolean;
  error: string | null;
  currentSubSubcategory: SubSubcategory | null;
  success: boolean;
  message: string | null;
}
