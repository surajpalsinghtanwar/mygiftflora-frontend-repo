import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Category, CreateCategoryDto, UpdateCategoryDto, CategoryState } from '../types/category';

const API_BASE_URL = 'http://localhost:8000/api';

// Async thunks
export const fetchCategories = createAsyncThunk<Category[]>(
  'categories/fetchAll',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE_URL}/admin/categories`, {
        mode: 'cors',
        credentials: 'include',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      const data = await res.json();

      if (!res.ok || data.success === false) {
        return thunkAPI.rejectWithValue(data.message || 'Failed to fetch categories');
      }

      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Network error occurred');
    }
  }
);

export const fetchCategory = createAsyncThunk<Category, string>(
  'categories/fetchOne',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE_URL}/admin/category/${id}`, {
        mode: 'cors',
        credentials: 'include',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      const data = await res.json();

      if (!res.ok || data.success === false) {
        return thunkAPI.rejectWithValue(data.message || 'Failed to fetch category');
      }

      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Network error occurred');
    }
  }
);

export const createCategory = createAsyncThunk<Category, CreateCategoryDto>(
  'categories/create',
  async (categoryData, thunkAPI) => {
    try {
      const token = localStorage.getItem('access_token');
      const formData = new FormData();
      
      formData.append('name', categoryData.name);
      formData.append('icon', categoryData.icon);
      
      if (categoryData.meta_title) {
        formData.append('meta_title', categoryData.meta_title);
      }
      if (categoryData.meta_description) {
        formData.append('meta_description', categoryData.meta_description);
      }
      if (categoryData.banner) {
        formData.append('banner', categoryData.banner);
      }

      const res = await fetch(`${API_BASE_URL}/admin/category`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || data.success === false) {
        return thunkAPI.rejectWithValue(data.message || 'Failed to create category');
      }

      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Network error occurred');
    }
  }
);

export const updateCategory = createAsyncThunk<
  Category,
  { id: string; data: UpdateCategoryDto }
>('categories/update', async ({ id, data }, thunkAPI) => {
  try {
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    
  if (data.name) formData.append('name', data.name);
  if (data.icon) formData.append('icon', data.icon);
  if (data.meta_title) formData.append('meta_title', data.meta_title);
  if (data.meta_description) formData.append('meta_description', data.meta_description);
  if (data.banner) formData.append('banner', data.banner);
  if (data.status) formData.append('status', data.status);

    const res = await fetch(`${API_BASE_URL}/admin/category/${id}`, {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const responseData = await res.json();

    if (!res.ok || responseData.success === false) {
      return thunkAPI.rejectWithValue(responseData.message || 'Failed to update category');
    }

    return responseData.data;
  } catch (error) {
    return thunkAPI.rejectWithValue('Network error occurred');
  }
});

export const deleteCategory = createAsyncThunk<string, string>(
  'categories/delete',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE_URL}/admin/category/${id}`, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'include',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      const data = await res.json();

      if (!res.ok || data.success === false) {
        return thunkAPI.rejectWithValue(data.message || 'Failed to delete category');
      }

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue('Network error occurred');
    }
  }
);

const initialState: CategoryState = {
  categories: [],
  category: null,
  loading: false,
  error: null,
  success: false,
  message: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Categories
    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      console.log('action', action.payload);
      state.loading = false;
      state.categories = action.payload;
      state.error = null;
      console.log('state.categories', state.categories);
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Single Category
    builder.addCase(fetchCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.category = action.payload;
      state.error = null;
    });
    builder.addCase(fetchCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Category
    builder.addCase(createCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(createCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.categories.push(action.payload);
      state.success = true;
      state.message = 'Category created successfully';
      state.error = null;
    });
    builder.addCase(createCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    // Update Category
    builder.addCase(updateCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(updateCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = state.categories.map((category) =>
        category.id === action.payload.id ? action.payload : category
      );
      state.category = action.payload;
      state.success = true;
      state.message = 'Category updated successfully';
      state.error = null;
    });
    builder.addCase(updateCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    // Delete Category
    builder.addCase(deleteCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload
      );
      state.success = true;
      state.message = 'Category deleted successfully';
      state.error = null;
    });
    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
  },
});

export const { clearError, clearSuccess } = categorySlice.actions;
export default categorySlice.reducer;
