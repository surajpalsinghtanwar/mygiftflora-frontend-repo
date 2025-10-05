import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { SubSubcategoryState, SubSubcategory, CreateSubSubcategoryDto, UpdateSubSubcategoryDto } from '../types/subsubcategory';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

const initialState: SubSubcategoryState = {
  subSubcategories: [],
  loading: false,
  error: null,
  currentSubSubcategory: null,
  success: false,
  message: null,
};

export const fetchSubSubcategories = createAsyncThunk(
  'subSubcategories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/v1/inventory/sub-subcategories`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { success: false, message: 'Failed to fetch subsubcategories' });
    }
  }
);

export const fetchSubSubcategoryById = createAsyncThunk(
  'subSubcategories/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/v1/inventory/sub-subcategories/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { success: false, message: 'Failed to fetch subsubcategory' });
    }
  }
);

export const createSubSubcategory = createAsyncThunk(
  'subSubcategories/create',
  async (data: CreateSubSubcategoryDto, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('categoryId', data.categoryId);
      formData.append('subcategoryId', data.subcategoryId);
      if (data.icon) formData.append('icon', data.icon);
      if (data.image) formData.append('image', data.image);
      if (data.status) formData.append('status', data.status);
      const response = await axios.post(`${API_URL}/v1/inventory/sub-subcategories`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { success: false, message: 'Failed to create subsubcategory' });
    }
  }
);

export const updateSubSubcategory = createAsyncThunk(
  'subSubcategories/update',
  async ({ id, data }: { id: string; data: UpdateSubSubcategoryDto }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (data.name) formData.append('name', data.name);
      if (data.categoryId) formData.append('categoryId', data.categoryId);
      if (data.subcategoryId) formData.append('subcategoryId', data.subcategoryId);
      if (data.icon) formData.append('icon', data.icon);
      if (data.image) formData.append('image', data.image);
      if (data.status) formData.append('status', data.status);
      const response = await axios.put(`${API_URL}/v1/inventory/sub-subcategories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { success: false, message: 'Failed to update subsubcategory' });
    }
  }
);

export const deleteSubSubcategory = createAsyncThunk(
  'subSubcategories/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/v1/inventory/sub-subcategories/${id}`);
      return { success: true, id, message: 'SubSubcategory deleted successfully' };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { success: false, message: 'Failed to delete subsubcategory' });
    }
  }
);

const subSubcategorySlice = createSlice({
  name: 'subSubcategories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = null;
    },
    clearCurrentSubSubcategory: (state) => {
      state.currentSubSubcategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubSubcategories.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchSubSubcategories.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.subSubcategories = Array.isArray(action.payload.data) ? action.payload.data : [];
          state.success = true;
          state.message = action.payload.message || 'SubSubcategories fetched successfully';
        } else {
          state.success = false;
          state.error = action.payload.message || 'Failed to fetch subsubcategories';
        }
      })
      .addCase(fetchSubSubcategories.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.message || 'Failed to fetch subsubcategories';
        state.success = false;
      })
      .addCase(fetchSubSubcategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchSubSubcategoryById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.currentSubSubcategory = action.payload.data;
          state.success = true;
          state.message = action.payload.message || 'SubSubcategory fetched successfully';
        } else {
          state.success = false;
          state.error = action.payload.message || 'Failed to fetch subsubcategory';
        }
      })
      .addCase(fetchSubSubcategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.message || 'Failed to fetch subsubcategory';
        state.success = false;
      })
      .addCase(createSubSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createSubSubcategory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.subSubcategories.push(action.payload.data);
          state.success = true;
          state.message = action.payload.message || 'SubSubcategory created successfully';
        } else {
          state.success = false;
          state.error = action.payload.message || 'Failed to create subsubcategory';
        }
      })
      .addCase(createSubSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.message || 'Failed to create subsubcategory';
        state.success = false;
      })
      .addCase(updateSubSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateSubSubcategory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          const index = state.subSubcategories.findIndex(cat => cat.id === action.payload.data.id);
          if (index !== -1) {
            state.subSubcategories[index] = action.payload.data;
          }
          state.currentSubSubcategory = action.payload.data;
          state.success = true;
          state.message = action.payload.message || 'SubSubcategory updated successfully';
        } else {
          state.success = false;
          state.error = action.payload.message || 'Failed to update subsubcategory';
        }
      })
      .addCase(updateSubSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.message || 'Failed to update subsubcategory';
        state.success = false;
      })
      .addCase(deleteSubSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteSubSubcategory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.subSubcategories = state.subSubcategories.filter(cat => cat.id !== action.payload.id);
          state.success = true;
          state.message = action.payload.message || 'SubSubcategory deleted successfully';
        } else {
          state.success = false;
          state.error = action.payload.message || 'Failed to delete subsubcategory';
        }
      })
      .addCase(deleteSubSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.message || 'Failed to delete subsubcategory';
        state.success = false;
      });
  },
});
export const { clearError, clearSuccess, clearCurrentSubSubcategory } = subSubcategorySlice.actions;
export default subSubcategorySlice.reducer;
