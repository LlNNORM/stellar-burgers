import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../utils/burger-api';
import type { RootState } from './store';
import { TOrder } from '@utils-types';

interface FeedsState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
}

const initialState: FeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk<
  { orders: TOrder[]; total: number; totalToday: number },
  void,
  { rejectValue: string }
>('feeds/fetch', async (_, { rejectWithValue }) => {
  try {
    return await getFeedsApi();
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchFeeds.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchFeeds.fulfilled, (s, a) => {
      s.loading = false;
      s.orders = a.payload.orders;
      s.total = a.payload.total;
      s.totalToday = a.payload.totalToday;
    });
    b.addCase(fetchFeeds.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload ?? 'Unknown error';
    });
  }
});

export default feedsSlice.reducer;

export const selectFeedsOrders = (s: RootState) => s.feeds.orders;
export const selectFeedsTotal = (s: RootState) => s.feeds.total;
export const selectFeedsTotalToday = (s: RootState) => s.feeds.totalToday;
export const selectFeedsLoading = (s: RootState) => s.feeds.loading;
export const selectFeedsError = (s: RootState) => s.feeds.error;
