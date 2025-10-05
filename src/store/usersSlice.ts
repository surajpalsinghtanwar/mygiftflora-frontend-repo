import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { UsersState, CreateUserPayload, User } from '../types/users';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, thunkAPI) => {
  try {
    console.log('Fetching users from API---------');
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    console.log('Fetched users:', data);
    if (!response.ok) return thunkAPI.rejectWithValue(data.message || 'Failed to fetch users');
    return data.data?.users || [];
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to fetch users');
  }
});

export const createUser = createAsyncThunk('users/create', async (payload: CreateUserPayload, thunkAPI) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/users/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) return thunkAPI.rejectWithValue(data.message || 'Failed to create user');
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to create user');
  }
});

export const updateUser = createAsyncThunk('users/update', async ({ id, ...payload }: User, thunkAPI) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) return thunkAPI.rejectWithValue(data.message || 'Failed to update user');
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to update user');
  }
});

export const deleteUser = createAsyncThunk('users/delete', async (id: string, thunkAPI) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) return thunkAPI.rejectWithValue(data.message || 'Failed to delete user');
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to delete user');
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.map(u => u.id === action.payload.id ? action.payload : u);
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(u => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default usersSlice.reducer;
