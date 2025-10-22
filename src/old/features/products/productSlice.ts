import { createAsyncThunk, createSlice, type PayloadAction, type SerializedError } from '@reduxjs/toolkit';

import type { ProductState, ProductSummary } from '../../types/ProductsTypes';
import type { RootState } from '../../store';

import { 
    fetchProducts, 
    fetchProductById, 
    fetchProductsByCategory, 
    fetchProductsBySubCategory,
    fetchProductsBySubSubCategory,
    fetchProductBySlug
} from '../../services/productService';

const initialState: ProductState = {
  list: [],
  selectedProduct: null,
  status: 'idle',
  error: null,
};

export const fetchProductsAsync = createAsyncThunk('products/fetchAll', async () => await fetchProducts());
export const fetchProductByIdAsync = createAsyncThunk('products/fetchById', async (id: string) => await fetchProductById(id));
export const fetchProductBySlugAsync = createAsyncThunk('products/fetchBySlug', async (slug: string) => await fetchProductBySlug(slug));
export const fetchProductsByCategoryAsync = createAsyncThunk('products/fetchByCategory', async (categorySlug: string) => await fetchProductsByCategory(categorySlug));
export const fetchProductsBySubCategoryAsync = createAsyncThunk(
  'products/fetchBySubCategory',
  async (params: { categorySlug: string; subCategorySlug: string }) => {
    return await fetchProductsBySubCategory(params.categorySlug, params.subCategorySlug);
  }
);
export const fetchProductsBySubSubCategoryAsync = createAsyncThunk<ProductSummary[], { categorySlug: string; subCategorySlug: string; subSubCategorySlug: string }, { state: RootState, rejectValue: string }>(
  'products/fetchBySubSubCategory',
  async (params, { rejectWithValue }) => {
    try {
      // Calls fetchProductsBySubSubCategory from productService with destructured params
      const products = await fetchProductsBySubSubCategory(params.categorySlug, params.subCategorySlug, params.subSubCategorySlug);
      return products;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch products by sub-subcategory.');
    }
  }
);

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductList: (state) => {
        state.list = [];
        state.status = 'idle';
    }
  },

  extraReducers: (builder) => {
    const handleListPending = (state: ProductState) => {
      state.status = 'loading';
      state.list = []; // Clear previous results
      state.error = null;
    };
    const handleListFulfilled = (state: ProductState, action: PayloadAction<ProductSummary[]>) => {
      state.status = 'succeeded';
      state.list = action.payload;
    };
    const handleListRejected = (state: ProductState,  action: { error: SerializedError }) => {
      state.status = 'failed';
      state.error = action.error.message || 'Failed to fetch product list.';
    };

    builder
      .addCase(fetchProductByIdAsync.pending, (state) => { state.status = 'loading'; state.selectedProduct = null; })
      .addCase(fetchProductByIdAsync.fulfilled, (state, action) => { state.status = 'succeeded'; state.selectedProduct = action.payload; })
      .addCase(fetchProductByIdAsync.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message || 'Could not load product details.'; })
      .addCase(fetchProductBySlugAsync.pending, (state) => { state.status = 'loading'; state.selectedProduct = null; })
      .addCase(fetchProductBySlugAsync.fulfilled, (state, action) => { state.status = 'succeeded'; state.selectedProduct = action.payload; })
      .addCase(fetchProductBySlugAsync.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message || 'Could not load product details.'; })
      
      // All List page thunks use the reusable handlers
      .addCase(fetchProductsAsync.pending, handleListPending)
      .addCase(fetchProductsAsync.fulfilled, handleListFulfilled)
      .addCase(fetchProductsAsync.rejected, handleListRejected)
      .addCase(fetchProductsByCategoryAsync.pending, handleListPending)
      .addCase(fetchProductsByCategoryAsync.fulfilled, handleListFulfilled)
      .addCase(fetchProductsByCategoryAsync.rejected, handleListRejected)
      .addCase(fetchProductsBySubCategoryAsync.pending, handleListPending)
      .addCase(fetchProductsBySubCategoryAsync.fulfilled, handleListFulfilled)
      .addCase(fetchProductsBySubCategoryAsync.rejected, handleListRejected)
            // fetchProductsBySubSubCategoryAsync
      .addCase(fetchProductsBySubSubCategoryAsync.pending, handleListPending)
      .addCase(fetchProductsBySubSubCategoryAsync.fulfilled, handleListFulfilled)
      .addCase(fetchProductsBySubSubCategoryAsync.rejected, handleListRejected); // Use the reusable rejected handler


  },
});

export const { clearProductList } = productSlice.actions;

export const selectProductList = (state: RootState) => state.products.list;
export const selectSelectedProduct = (state: RootState) => state.products.selectedProduct;
export const selectProductStatus = (state: RootState) => state.products.status;
export const selectProductError = (state: RootState) => state.products.error;

export default productSlice.reducer;