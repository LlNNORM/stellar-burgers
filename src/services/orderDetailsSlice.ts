import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '../utils/burger-api';
import type { RootState } from './store';
import { TOrder } from '@utils-types';

interface OrderDetailsState {
  data: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderDetailsState = {
  data: null,
  loading: false,
  error: null
};

export const fetchOrderDetails = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('orderDetails/fetch', async (number, { rejectWithValue }) => {
  try {
    const res = await getOrderByNumberApi(number);
    return res.orders[0];
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    clearOrderDetails: (s) => {
      s.data = null;
      s.loading = false;
      s.error = null;
    }
  },
  extraReducers: (b) => {
    b.addCase(fetchOrderDetails.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchOrderDetails.fulfilled, (s, a) => {
      s.loading = false;
      s.data = a.payload;
    });
    b.addCase(fetchOrderDetails.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload ?? 'Unknown error';
    });
  }
});

export const { clearOrderDetails } = orderDetailsSlice.actions;
export default orderDetailsSlice.reducer;

export const selectOrderData = (s: RootState) => s.orderDetails.data;
export const selectOrderLoading = (s: RootState) => s.orderDetails.loading;
export const selectOrderError = (s: RootState) => s.orderDetails.error;
