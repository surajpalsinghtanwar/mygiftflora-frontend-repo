import type { ProductSummary } from './ProductsTypes';

export interface CartItem extends ProductSummary {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}