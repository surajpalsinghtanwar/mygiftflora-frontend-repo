// src/types/HomeTypes.ts

import type { ProductSummary } from './ProductsTypes'; // Assuming ProductSummary exists

export interface SliderItem {
  id: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  link: string;
  buttonText?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  imageUrl: string;
  slug: string; // For linking to product listing
}

export interface HomePageData {
  sliders: SliderItem[];
  featuredCategories: CategoryItem[];
  newArrivals: ProductSummary[];
  featuredProducts: ProductSummary[];
}

export interface HomeState {
  data: HomePageData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}