// services/burgerConstructorSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../utils/burger-api';
import type { RootState } from './store';
import { TIngredient, TOrder } from '@utils-types';
import { createSelector } from '@reduxjs/toolkit';

interface ConstructorState {
  bun: TIngredient | null;
  ingredients: TIngredient[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const createOrder = createAsyncThunk<
  TOrder,
  void,
  { state: RootState; rejectValue: string }
>('constructor/createOrder', async (_, { getState, rejectWithValue }) => {
  const { bun, ingredients } = getState().burgerConstructor;
  if (!bun) return rejectWithValue('Булка не выбрана');

  const ingredientIds = [
    bun._id,
    ...ingredients.map((ingredient) => ingredient._id),
    bun._id
  ];
  try {
    const response = await orderBurgerApi(ingredientIds);
    return response.order;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ошибка при создании заказа');
  }
});

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const ingredient = action.payload;
      if (ingredient.type === 'bun') {
        state.bun = ingredient;
      } else {
        state.ingredients.push(ingredient);
      }
    },
    removeIngredient: (state, action: PayloadAction<number>) => {
      const indexToRemove = action.payload;
      state.ingredients.splice(indexToRemove, 1);
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const itemsCopy = [...state.ingredients];
      const [movedItem] = itemsCopy.splice(fromIndex, 1);
      itemsCopy.splice(toIndex, 0, movedItem);
      state.ingredients = itemsCopy;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    clearOrderModal: (state) => {
      state.orderModalData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state) => {
      state.orderRequest = true;
      state.error = null;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.orderRequest = false;
      state.orderModalData = action.payload;
      state.bun = null;
      state.ingredients = [];
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.orderRequest = false;
      state.error = action.payload ?? 'Unknown error';
    });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  clearOrderModal
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;

export const selectConstructorBun = (state: RootState) =>
  state.burgerConstructor.bun;
export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor.ingredients;

export const selectBurgerConstructor = (state: RootState) => {
  const bun = state.burgerConstructor.bun;
  const ingredients = state.burgerConstructor.ingredients;
  return { bun, ingredients };
};

export const selectIngredientCount = (id: string) =>
  createSelector(
    [selectConstructorItems, selectConstructorBun],
    (ingredients, bun) => {
      let count = ingredients.filter((item) => item._id === id).length;
      if (bun && bun._id === id) count += 2;
      return count;
    }
  );

export const selectOrderRequest = (state: RootState) =>
  state.burgerConstructor.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.burgerConstructor.orderModalData;
export const selectConstructorError = (state: RootState) =>
  state.burgerConstructor.error;

export const selectTotalPrice = createSelector(
  [selectConstructorBun, selectConstructorItems],
  (bun, ingredients) => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const itemsPrice = ingredients.reduce(
      (sum, ingredient) => sum + ingredient.price,
      0
    );
    return bunPrice + itemsPrice;
  }
);
