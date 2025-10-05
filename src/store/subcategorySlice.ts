import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Subcategory, CreateSubcategoryDto, UpdateSubcategoryDto, SubcategoryState } from '../types/subcategory';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

// Async thunks
export const fetchSubcategories = createAsyncThunk(
  'subcategories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/v1/inventory/subcategories`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subcategories');
    }
  }
);

export const fetchSubcategoryById = createAsyncThunk(
  'subcategories/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/v1/inventory/subcategory/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subcategory');
    }
  }
);

export const createSubcategory = createAsyncThunk(
  'subcategories/create',
  async (data: CreateSubcategoryDto, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('categoryId', data.categoryId);
      if (data.icon) formData.append('icon', data.icon);
      if (data.banner) formData.append('banner', data.banner);
      if (data.meta_title) formData.append('meta_title', data.meta_title);
      if (data.meta_description) formData.append('meta_description', data.meta_description);

      const response = await axios.post(`${API_URL}/v1/inventory/subcategory`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create subcategory');
    }
  }
);

export const updateSubcategory = createAsyncThunk(
  'subcategories/update',
  async ({ id, data }: { id: string; data: UpdateSubcategoryDto }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (data.name) formData.append('name', data.name);
      if (data.categoryId) formData.append('categoryId', data.categoryId);
      if (data.icon) formData.append('icon', data.icon);
      if (data.banner) formData.append('banner', data.banner);
      if (data.meta_title) formData.append('meta_title', data.meta_title);
      if (data.meta_description) formData.append('meta_description', data.meta_description);

      const response = await axios.put(`${API_URL}/v1/inventory/subcategory/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update subcategory');
    }
  }
);

export const deleteSubcategory = createAsyncThunk(
  'subcategories/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/v1/inventory/subcategory/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete subcategory');
    }
  }
);

const initialState: SubcategoryState = {
  subcategories: [],
  loading: false,
  error: null,
  currentSubcategory: null,
  success: false,
  message: null,
};

const subcategorySlice = createSlice({
  name: 'subcategories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = null;
    },
    clearCurrentSubcategory: (state) => {
      state.currentSubcategory = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all subcategories
      .addCase(fetchSubcategories.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = Array.isArray(action.payload?.data) ? action.payload.data : [];
        state.success = true;
        state.message = 'Subcategories fetched successfully';
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      // Fetch single subcategory
      .addCase(fetchSubcategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchSubcategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubcategory = action.payload?.data || action.payload;
        state.success = true;
        state.message = 'Subcategory fetched successfully';
      })
      .addCase(fetchSubcategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      // Create subcategory
      .addCase(createSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createSubcategory.fulfilled, (state, action: PayloadAction<Subcategory>) => {
        state.loading = false;
        state.subcategories.push(action.payload);
        state.success = true;
        state.message = 'Subcategory created successfully';
      })
      .addCase(createSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      // Update subcategory
      .addCase(updateSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateSubcategory.fulfilled, (state, action: PayloadAction<Subcategory>) => {
        state.loading = false;
        const index = state.subcategories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.subcategories[index] = action.payload;
        }
        state.currentSubcategory = action.payload;
        state.success = true;
        state.message = 'Subcategory updated successfully';
      })
      .addCase(updateSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      // Delete subcategory
      .addCase(deleteSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteSubcategory.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.subcategories = state.subcategories.filter(cat => cat.id !== action.payload);
        state.success = true;
        state.message = 'Subcategory deleted successfully';
      })
      .addCase(deleteSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  }
});

export const { clearError, clearSuccess, clearCurrentSubcategory } = subcategorySlice.actions;
export default subcategorySlice.reducer;
