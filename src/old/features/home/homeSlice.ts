// src/features/home/homeSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { HomeState, HomePageData } from '../../types/HomeTypes';
import { fetchHomePageData } from '../../services/homeService';
import type { RootState } from '../../store'; // Assuming store is in src/store/index.ts

const initialState: HomeState = {
  data: null,
  status: 'idle',
  error: null,
};

// Async thunk to fetch home page data
export const fetchHomePageDataAsync = createAsyncThunk<HomePageData, void, { state: RootState }>(
  'home/fetchHomePageData',
  // FIX: Use _ for the ignored first parameter
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchHomePageData();
      return data;
    } catch (error) {
      // Assuming handleApiResponse throws an error with a message
      return rejectWithValue((error as Error).message || 'Failed to fetch home page data.');
    }
  },
  {
    // Optional: prevent fetching if data already exists and is not stale
    // FIX: Use _ for the ignored first parameter
    condition: (_, { getState }) => {
      const { home } = getState();
      if (home.status === 'succeeded') {
        // You could add a check here if the data is stale
        return false; // Don't refetch if already successful
      }
      return true;
    }
  }
);

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    // You can add reducers for local state updates if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomePageDataAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchHomePageDataAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchHomePageDataAsync.rejected, (state, action) => {
        // action.payload contains the value from rejectWithValue
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch home page data.';
        state.data = null; // Clear data on failure
      });
  },
});

// Export the reducer
export default homeSlice.reducer;

// Export selectors
export const selectHomePageData = (state: RootState) => state.home.data;
export const selectHomePageStatus = (state: RootState) => state.home.status;
export const selectHomePageError = (state: RootState) => state.home.error;