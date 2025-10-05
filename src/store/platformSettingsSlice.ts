import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { PlatformSettings } from '../types/platformSettings';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const fetchPlatformSettings = createAsyncThunk<PlatformSettings>(
  'platformSettings/fetch',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('access_token');
      
      // Create request options with explicit method
      const requestOptions = {
        method: 'GET',
        headers: { 
          Authorization: `Bearer ${token}`,
        },
      };
      
      console.log('Request Method:', requestOptions.method);
      const res = await fetch(`${API_BASE_URL}/admin/settings`, requestOptions);
      const data = await res.json();

      if (!res.ok || data.success === false) {
        return thunkAPI.rejectWithValue(data.message || 'Failed to fetch settings');
      }

      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Network error occurred');
    }
  }
);

export const updatePlatformSettings = createAsyncThunk<
  any,
  FormData
>('platformSettings/update', async (formData, thunkAPI) => {
  try {
    const token = localStorage.getItem('access_token');
    
    // Create request options with explicit method
    const requestOptions = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    };
    
    console.log('Request Method:', requestOptions.method);
    const res = await fetch(`${API_BASE_URL}/admin/settings`, requestOptions);
    const data = await res.json();

    if (!res.ok || data.success === false) {
      return thunkAPI.rejectWithValue(data.message || 'Failed to update settings');
    }

    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue('Network error occurred');
  }
});

interface PlatformSettingsState {
  settings: PlatformSettings | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
}

const initialState: PlatformSettingsState = {
  settings: null,
  loading: false,
  error: null,
  success: false,
  message: null,
};

const platformSettingsSlice = createSlice({
  name: 'platformSettings',
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
    // Fetch Settings
    builder.addCase(fetchPlatformSettings.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchPlatformSettings.fulfilled,
      (state, action: PayloadAction<PlatformSettings>) => {
        state.loading = false;
        state.settings = action.payload;
        state.error = null;
      }
    );
    builder.addCase(fetchPlatformSettings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Settings
    builder.addCase(updatePlatformSettings.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(updatePlatformSettings.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = action.payload.message;
      state.settings = action.payload.data;
      state.error = null;
    });
    builder.addCase(updatePlatformSettings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
  },
});

export const { clearError, clearSuccess } = platformSettingsSlice.actions;
export default platformSettingsSlice.reducer;
