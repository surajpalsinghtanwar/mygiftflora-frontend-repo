import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthState , LoginPayload } from '../types/auth';
import { setToLocalStorage, removeFromLocalStorage, getFromLocalStorage } from '../utils/localStorage';

const initialState: AuthState = {
  user: null,
  token: getFromLocalStorage('access_token'),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, thunkAPI) => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/login', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      // Check both HTTP status and API success property
      if (!response.ok || data.success === false) {
        return thunkAPI.rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: 'Login failed' });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      removeFromLocalStorage('access_token');
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        // Save token to localStorage
        if (action.payload?.access_token) {
          setToLocalStorage('access_token', action.payload.access_token);
        }
        state.token = action.payload?.access_token || null;
        state.user = action.payload?.admin || null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        // Support both string and object error payloads
        if (typeof action.payload === 'string') {
          state.error = action.payload;
        } else if (action.payload && typeof action.payload === 'object' && 'message' in action.payload) {
          state.error = (action.payload as any).message;
        } else {
          state.error = 'Login failed';
        }
        state.token = null;
        state.user = null;
        removeFromLocalStorage('access_token');
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
