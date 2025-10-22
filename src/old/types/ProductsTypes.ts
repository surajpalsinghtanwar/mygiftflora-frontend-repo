// A single link in a breadcrumb trail
export type Breadcrumb = {
  label: string;
  path: string;
};

// A product specification item
export type Specification = {
  name: string;
  value: string;
};

// A lightweight summary for product cards
export type ProductSummary = {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  path: string;
  rating?: number; 
  reviewsCount?: number;
};

// The main product data structure
export type Product = {
  id: string;
  name: string;
  sku: string;
  breadcrumbs: Breadcrumb[];
  images: string[];
  price: number;
  slug:string;
  originalPrice: number;
  shortDescription: string;
  longDescription: string;
  specifications: Specification[];
};

// The complete data structure returned from the API/JSON file
export interface ProductDetailData extends Product {
  relatedProducts: ProductSummary[];
}

// Add this generic interface to your types file
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T; // 'T' is a placeholder for whatever data type is expected (e.g., ProductSummary[] or ProductDetailData)
  error: string | null;
}

export interface ProductInfoProps {
  product: ProductDetailData;
}

// Define the shape of the slice's state
export interface ProductState {
  list: ProductSummary[];              // For category and subcategory listing pages
  selectedProduct: ProductDetailData | null; // For the single product detail page
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export interface ProductCardProps {
  product: ProductSummary;
}
