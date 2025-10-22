import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Import the types we need
import type { LoginFormValues, RegistrationFormValues, User, AuthResponse } from './authTypes';
import { login, register } from '../../services/authService';
import { RootState } from '../../store';
// Import the service functions from our new mock service


export interface AuthState {
  userInfo: User | null;
  token: string | null;
  loading: 'idle' | 'pending';
  error: string | null;
}

const initialState: AuthState = {
  userInfo: null,
  token: null,
  loading: 'idle',
  error: null,
};

// --- LOGIN THUNK ---
// This thunk calls the login function from our authService.
export const loginUser = createAsyncThunk<AuthResponse, LoginFormValues, { rejectValue: string }>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await login(credentials); // Call the service
      return data;
    } catch (error) {
      // The service throws an error, which we catch here.
      // rejectWithValue sends a clean error message to our reducer's 'rejected' case.
      return rejectWithValue((error as Error).message);
    }
  }
);

// --- REGISTRATION THUNK ---
// This thunk calls the register function from our authService.
export const registerUser = createAsyncThunk<AuthResponse, RegistrationFormValues, { rejectValue: string }>(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await register(userData); // Call the service
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
    },
  },
  // ▼▼▼ THIS SECTION IS NOW CORRECTED ▼▼▼
  extraReducers: (builder) => {
    builder
      // Handle login states
      .addCase(loginUser.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        // Here, TypeScript correctly knows `action.payload` is an `AuthResponse`
        state.loading = 'idle';
        state.userInfo = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = 'idle';
        state.error = action.payload as string;
      })

      // Handle registration states
      .addCase(registerUser.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        // Here, TypeScript also knows `action.payload` is an `AuthResponse`
        state.loading = 'idle';
        state.userInfo = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = 'idle';
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;

// --- Selectors remain unchanged ---
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectUser = (state: RootState ) => state.auth.userInfo;
export const selectIsLoggedIn = (state: RootState) => !!state.auth.token;
