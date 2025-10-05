import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ProductState, CreateProductPayload, UpdateProductPayload } from '../types/product';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  currentProduct: null,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/v1/inventory/products`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      const data = response.data;
      
      console.log('Fetch products API response:', data);
      console.log('Products data array:', data.data);

      if (!response.status || response.status !== 200 || data.success === false) {
        return thunkAPI.rejectWithValue(data.message || 'Failed to fetch products');
      }

      const productsArray = data.data || [];
      console.log('Returning products array:', productsArray);
      return productsArray;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Network error occurred');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/v1/inventory/products/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      const data = response.data;

      if (!response.status || response.status !== 200 || data.success === false) {
        return thunkAPI.rejectWithValue(data.message || 'Failed to fetch product');
      }

      return data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Network error occurred');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  async (payload: CreateProductPayload) => {
    const formData = new FormData();
    
    // Append basic product data
    formData.append('name', payload.name);
    formData.append('description', payload.description);
    formData.append('price', payload.price.toString());
    if (payload.salePrice) formData.append('salePrice', payload.salePrice.toString());
    formData.append('categoryId', payload.categoryId);
    if (payload.subcategoryId) formData.append('subcategoryId', payload.subcategoryId);
    if (payload.subSubcategoryId) formData.append('subSubcategoryId', payload.subSubcategoryId);
    formData.append('sku', payload.sku);
    formData.append('stock', payload.stock.toString());
    formData.append('isActive', (payload.isActive ?? true).toString());

    // Append specifications if any
    if (payload.specifications) {
      formData.append('specifications', JSON.stringify(payload.specifications));
    }

    // Append extended data if provided
    if (payload.dimensions) {
      formData.append('dimensions', JSON.stringify(payload.dimensions));
    }

    if (payload.logistics) {
      formData.append('logistics', JSON.stringify(payload.logistics));
    }

    if (payload.furniture) {
      formData.append('furniture', JSON.stringify(payload.furniture));
    }

    if (payload.seo) {
      formData.append('seo', JSON.stringify(payload.seo));
    }

    // Append main image
    if (payload.mainImage) {
      formData.append('mainImage', payload.mainImage);
    }

    // Append gallery images
    if (payload.galleryImages) {
      payload.galleryImages.forEach((image) => {
        formData.append('galleryImages', image);
      });
    }

    const token = localStorage.getItem('access_token');
    const response = await axios.post(`${API_URL}/v1/inventory/product`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    
    const responseData = response.data;
    if (!response.status || response.status !== 200 || responseData.success === false) {
      throw new Error(responseData.message || 'Failed to create product');
    }
    
    return responseData.data;
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async (payload: UpdateProductPayload, thunkAPI) => {
    try {
      const formData = new FormData();
      
      // Append only the fields that are being updated
      if (payload.name) formData.append('name', payload.name);
      if (payload.description) formData.append('description', payload.description);
      if (payload.price) formData.append('price', payload.price.toString());
      if (payload.salePrice !== undefined) formData.append('salePrice', payload.salePrice.toString());
      if (payload.categoryId) formData.append('categoryId', payload.categoryId);
      if (payload.subcategoryId) formData.append('subcategoryId', payload.subcategoryId);
      if (payload.subSubcategoryId) formData.append('subSubcategoryId', payload.subSubcategoryId);
      if (payload.sku) formData.append('sku', payload.sku);
      if (payload.stock !== undefined) formData.append('stock', payload.stock.toString());
      if (payload.isActive !== undefined) formData.append('isActive', payload.isActive.toString());

      if (payload.specifications) {
        formData.append('specifications', JSON.stringify(payload.specifications));
      }

      // Append main image if provided
      if (payload.mainImage) {
        formData.append('mainImage', payload.mainImage);
      }

      // Append gallery images if provided
      if (payload.galleryImages) {
        payload.galleryImages.forEach((image) => {
          formData.append('galleryImages', image);
        });
      }

      const token = localStorage.getItem('access_token');
      const response = await axios.put(`${API_URL}/v1/inventory/products/${payload.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = response.data;
      if (!response.status || response.status !== 200 || responseData.success === false) {
        return thunkAPI.rejectWithValue(responseData.message || 'Failed to update product');
      }

      return responseData.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Network error occurred');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.delete(`${API_URL}/v1/inventory/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = response.data;
      if (!response.status || response.status !== 200 || responseData.success === false) {
        return thunkAPI.rejectWithValue(responseData.message || 'Failed to delete product');
      }

      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Network error occurred');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      // Fetch single product
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch product';
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create product';
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex((prod) => prod.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.currentProduct = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update product';
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((prod) => prod.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete product';
      });
  },
});

export const { clearError, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
