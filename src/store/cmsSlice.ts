import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CmsPage, PageType } from '../types/cms';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

export const fetchCmsPages = createAsyncThunk<CmsPage[]>('cms/fetchCmsPages', async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE_URL}/v1/cms/pages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    
    if (!res.ok || data.success === false) {
      return thunkAPI.rejectWithValue(data.message || 'Failed to fetch page');
    }
    
    return data.data || [];
  } catch (error) {
    return thunkAPI.rejectWithValue('Network error occurred');
  }
});

export const fetchCmsPageById = createAsyncThunk<CmsPage, string>('cms/fetchCmsPageById', async (id, thunkAPI) => {
  try {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE_URL}/v1/cms/page/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    
    if (!res.ok || data.success === false) {
      return thunkAPI.rejectWithValue(data.message || 'Failed to fetch page');
    }
    
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue('Network error occurred');
  }
});

export const createCmsPage = createAsyncThunk<any, Omit<CmsPage, 'id'>>('cms/createCmsPage', async (page, thunkAPI) => {
  try {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE_URL}/v1/cms/page`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(page),
    });
    const data = await res.json();
    
    if (!res.ok || data.success === false) {
      return thunkAPI.rejectWithValue(data.message || 'Failed to create page');
    }
    
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue('Network error occurred');
  }
});

export const updateCmsPage = createAsyncThunk<any, { id: string; page: Partial<CmsPage> }>('cms/updateCmsPage', async ({ id, page }, thunkAPI) => {
  try {
    const token = localStorage.getItem('access_token');
    const url = `${API_BASE_URL}/v1/cms/page/${id}`;
    console.log('Update URL:', url);
    console.log('Update payload:', page);
    
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(page),
    });
    const data = await res.json();
    
    console.log('Update response:', data);
    
    if (!res.ok || data.success === false) {
      return thunkAPI.rejectWithValue(data.message || 'Failed to update page');
    }
    
    return data;
  } catch (error) {
    console.error('Update error:', error);
    return thunkAPI.rejectWithValue('Network error occurred');
  }
});

export const deleteCmsPage = createAsyncThunk<string, string>('cms/deleteCmsPage', async (id, thunkAPI) => {
  try {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE_URL}/v1/cms/page/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!res.ok) {
      const data = await res.json();
      return thunkAPI.rejectWithValue(data.message || 'Failed to delete page');
    }
    
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue('Network error occurred');
  }
});

interface CmsState {
  pages: CmsPage[];
  currentPage: CmsPage | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
}

const initialState: CmsState = {
  pages: [],
  currentPage: null,
  loading: false,
  error: null,
  success: false,
  message: null,
};

const cmsSlice = createSlice({
  name: 'cms',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = null;
    },
    clearCurrentPage: (state) => {
      state.currentPage = null;
    },
  },
  extraReducers: builder => {
    // Fetch CMS Pages
    builder.addCase(fetchCmsPages.pending, state => { 
      state.loading = true; 
      state.error = null;
    });
    builder.addCase(fetchCmsPages.fulfilled, (state, action: PayloadAction<CmsPage[]>) => {
      state.loading = false;
      state.pages = action.payload;
      state.error = null;
    });
    builder.addCase(fetchCmsPages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Failed to fetch page';
    });

    // Fetch CMS Page by ID
    builder.addCase(fetchCmsPageById.pending, state => { 
      state.loading = true; 
      state.error = null;
    });
    builder.addCase(fetchCmsPageById.fulfilled, (state, action: PayloadAction<CmsPage>) => {
      state.loading = false;
      state.currentPage = action.payload;
      state.error = null;
    });
    builder.addCase(fetchCmsPageById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Failed to fetch page';
    });

    // Create CMS Page
    builder.addCase(createCmsPage.pending, state => { 
      state.loading = true; 
      state.error = null;
      state.success = false;
    });
    builder.addCase(createCmsPage.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = action.payload.message;
      state.error = null;
      // Do not push to pages array - list will be refreshed from API
    });
    builder.addCase(createCmsPage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    // Update CMS Page
    builder.addCase(updateCmsPage.pending, state => { 
      state.loading = true; 
      state.error = null;
      state.success = false;
    });
    builder.addCase(updateCmsPage.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = action.payload.message;
      state.error = null;
      // Do not update pages array - list will be refreshed from API
      // Update currentPage for immediate UI feedback
      if (action.payload.data) {
        state.currentPage = action.payload.data;
      }
    });
    builder.addCase(updateCmsPage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    // Delete CMS Page
    builder.addCase(deleteCmsPage.pending, state => { 
      state.loading = true; 
      state.error = null;
    });
    builder.addCase(deleteCmsPage.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.pages = state.pages.filter(p => p.id !== action.payload);
      state.error = null;
      state.success = true;
      state.message = 'page deleted successfully';
    });
    builder.addCase(deleteCmsPage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, clearSuccess, clearCurrentPage } = cmsSlice.actions;
export default cmsSlice.reducer;