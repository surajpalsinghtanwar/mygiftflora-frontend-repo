// // C:\themurphy-ui\src\types\SharedTypes.ts
// // Define types that are used by both frontend and backend

import type { HomePageData } from "./HomeTypes.ts";
import type { Product, ProductDetailData, ProductSummary } from "./ProductsTypes.ts";

// import type { CategoryItem, SliderItem } from "./HomeTypes";
// import type { ProductDetailData, ProductSummary } from "./ProductsTypes";




export interface Specification {
    name: string;
    value: string;
}

// Define the shape of your RootState - matches the combined state of all slices
export interface RootState {
    products: {
        list: ProductSummary[];
        selectedProduct: ProductDetailData | null;
        status: 'idle' | 'loading' | 'succeeded' | 'failed' ;
        error: string | null;
    };
    auth: {
        token: string | null;
        userInfo: any | null;
        status: 'idle' | 'loading' | 'succeeded' | 'failed' | 'pending';
        error: string | null;
    };
     cart: {
         items: any[]; // Use your actual cart item type
         discount: number;
         status: 'idle' | 'loading' | 'succeeded' | 'failed';
         error: string | null;
    };
    wishlist: {
         items: any[]; // Use your actual wishlist item type
         status: 'idle' | 'loading' | 'succeeded' | 'failed';
         error: string | null;
    };
    home: {
         data: HomePageData | null; // Assuming HomePageData is defined here or imported
         status: 'idle' | 'loading' | 'succeeded' | 'failed';
         error: string | null;
    };
    // Add other slice states
}

// You might need to define or import HomePageData, SliderItem, CategoryItem here too
// Example placeholder structure if not imported:
