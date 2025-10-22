export interface Product {
  id: string;
  name: string;
  description: string;
  market_price?: string;
  selling_price?: string;
  price?: number;
  salePrice?: number;
  status: string;
  thumbnail?: string;
  slug?: string | null;
  brand?: string | null;
  breadcrumbs?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  likes: number;
  views: number;
  sales: number;
  average_rating: number;
  score: number;
  categoryId?: string;
  subcategoryId?: string;
  subSubcategoryId?: string;
  sku?: string;
  stock?: number;
  images?: string[];
  specifications?: Record<string, string>;
  isActive?: boolean;
  created_at: string;
  updated_at: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  categoryId: string;
  subcategoryId?: string;
  subSubcategoryId?: string;
  sku: string;
  stock: number;
  main_image?: File;
  galleryImages?: File[];
  specifications?: Record<string, string>;
  isActive?: boolean;
  // Extended fields
  dimensions?: {
    length: string;
    width: string;
    height: string;
    unit: string;
  };
  logistics?: {
    length: string;
    width: string;
    height: string;
    weight: string;
    warehouse: string;
    country: string;
    state: string;
    city: string;
  };
  furniture?: {
    material: string;
    color: string;
    style: string;
    shape: string;
    seating: string;
    storage: boolean;
    assembly: boolean;
    warranty: string;
    origin: string;
  };
  seo?: {
    title: string;
    description: string;
    keywords: string;
    canonical: string;
  };
}

export interface UpdateProductPayload {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  salePrice?: number;
  categoryId?: string;
  subcategoryId?: string;
  subSubcategoryId?: string;
  sku?: string;
  stock?: number;
  mainImage?: File;
  galleryImages?: File[];
  specifications?: Record<string, string>;
  isActive?: boolean;
}

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  currentProduct: Product | null;
}


// Product Tag
export interface ProductTag {
  tag: string;
}

// Product Furniture
export interface ProductFurniture {
  id?: string;
  material: string;
  color: string;
  depth: string;
  assembly_required: boolean;
  warranty: string;
  style: string;
  shape: string;
  seating_capacity: string;
  storage_included: boolean;
  country_of_origin: string;
}

// Product Spec
export interface ProductSpec {
  id: string;
  spec_key: string;
  spec_value: string;
}

// Product Logistics
export interface ProductLogistics {
  id?: string;
  length: string;
  width: string;
  height: string;
  weight: string;
  warehouse_id: string;
  default_country: string;
  default_state: string;
  default_city: string;
}

// Product SEO
export interface ProductSeo {
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  canonical_url: string;
}
