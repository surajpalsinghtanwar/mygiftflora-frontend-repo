import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Subscription {
  id: string;
  userId: string;
  userName: string;
  planId: string;
  planName: string;
  status: string;
  startDate: string;
  endDate: string;
}

export interface PaymentTransaction {
  id: string;
  userName: string;
  amount: number;
  status: string;
  date: string;
}

export interface SubscriptionState {
  subscriptions: Subscription[];
  transactions: PaymentTransaction[];
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  subscriptions: [],
  transactions: [],
  loading: false,
  error: null,
};

export const fetchSubscriptions = createAsyncThunk('subscriptions/fetch', async () => {
  // TODO: Replace with API call
  return [] as Subscription[];
});

export const createSubscription = createAsyncThunk('subscriptions/create', async (data: any) => {
  // TODO: Replace with API call
  return data;
});

export const fetchPaymentTransactions = createAsyncThunk('subscriptions/fetchTransactions', async () => {
  // TODO: Replace with API call
  return [] as PaymentTransaction[];
});

const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSubscriptions.pending, state => { state.loading = true; })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => { state.loading = false; state.subscriptions = action.payload; })
      .addCase(fetchSubscriptions.rejected, (state, action) => { state.loading = false; state.error = action.error.message || null; })
      .addCase(createSubscription.fulfilled, (state, action) => { state.subscriptions.push(action.payload); })
      .addCase(fetchPaymentTransactions.fulfilled, (state, action) => { state.transactions = action.payload; });
  }
});

export default subscriptionSlice.reducer;
