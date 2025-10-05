import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ProductTag } from '../types/product';

export const fetchProductTags = createAsyncThunk('productTags/fetch', async (productId: string) => {
  // TODO: Replace with API call
  return [] as ProductTag[];
});
export const addProductTag = createAsyncThunk('productTags/add', async ({ productId, tag }: { productId: string, tag: string }) => {
  // TODO: Replace with API call
  return { tag };
});
export const deleteProductTag = createAsyncThunk('productTags/delete', async ({ productId, tag }: { productId: string, tag: string }) => {
  // TODO: Replace with API call
  return tag;
});

const productTagSlice = createSlice({
  name: 'productTags',
  initialState: { tags: [] as ProductTag[], loading: false, error: null as string | null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProductTags.pending, state => { state.loading = true; })
      .addCase(fetchProductTags.fulfilled, (state, action) => { state.loading = false; state.tags = action.payload; })
      .addCase(fetchProductTags.rejected, (state, action) => { state.loading = false; state.error = action.error.message || null; })
      .addCase(addProductTag.fulfilled, (state, action) => { state.tags.push(action.payload); })
      .addCase(deleteProductTag.fulfilled, (state, action) => { state.tags = state.tags.filter(t => t.tag !== action.payload); });
  }
});

export default productTagSlice.reducer;
