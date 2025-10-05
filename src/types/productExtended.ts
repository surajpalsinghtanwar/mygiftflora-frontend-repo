import type { Brand } from './brand';

export interface ProductSpec {
  key: string;
  value: string;
}

export interface ProductDimension {
  length: number;
  width: number;
  height: number;
  unit: string; // e.g., 'cm', 'inch'
}

export interface ProductExtended {
  id: string;
  name: string;
  brandId: string;
  brand?: Brand;
  description: string; // HTML
  price: number;
  stock: number;
  sku: string;
  categoryId: string;
  isActive: boolean;
  mainImage: string;
  gallery: string[];
  specifications: ProductSpec[];
  dimensions: ProductDimension;
}
