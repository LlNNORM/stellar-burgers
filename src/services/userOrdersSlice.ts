import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi } from '../utils/burger-api';
import { TOrder } from '@utils-types';
import { RootState } from './store';

interface UserOrdersState {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: UserOrdersState = {
  orders: [],
  loading: false,
  error: null
};

export const fetchUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('userOrders/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await getOrdersApi();
    return response;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка загрузки заказов');
  }
});

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {
    clearUserOrders(state) {
      state.orders = [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (s, a: PayloadAction<TOrder[]>) => {
        s.loading = false;
        s.orders = a.payload;
      })
      .addCase(fetchUserOrders.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ?? 'Ошибка';
      });
  }
});

export const { clearUserOrders } = userOrdersSlice.actions;

export const selectUserOrders = (state: RootState) => state.userOrders.orders;
export const selectUserOrdersLoading = (state: RootState) =>
  state.userOrders.loading;
export const selectUserOrdersError = (state: RootState) =>
  state.userOrders.error;

export default userOrdersSlice.reducer;
