import reducer, { fetchIngredients } from './ingredientsSlice';
import type { TIngredient } from '@utils-types';
import {
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError
} from './ingredientsSlice';
import type { RootState } from './store';

describe('reducers', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Test Ingredient',
      type: 'main',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 100,
      price: 50,
      image: '',
      image_mobile: '',
      image_large: ''
    }
  ];

  it('should handle fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = reducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
  });

  it('should handle fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      payload: 'Failed to fetch'
    };
    const state = reducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to fetch');
  });
});

describe('selectors', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Test Ingredient',
      type: 'main',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 100,
      price: 50,
      image: 'img.jpg',
      image_mobile: 'img_mobile.jpg',
      image_large: 'img_large.jpg'
    }
  ];

  const mockRootState: RootState = {
    ingredients: {
      items: mockIngredients,
      loading: true,
      error: 'Something went wrong'
    },
    burgerConstructor: {} as any,
    feeds: {} as any,
    orderDetails: {} as any,
    user: {} as any,
    userOrders: {} as any
  };

  it('selectIngredients', () => {
    const result = selectIngredients(mockRootState);
    expect(result).toEqual(mockIngredients);
  });

  it('selectIngredientsLoading', () => {
    const result = selectIngredientsLoading(mockRootState);
    expect(result).toBe(true);
  });

  it('selectIngredientsError', () => {
    const result = selectIngredientsError(mockRootState);
    expect(result).toBe('Something went wrong');
  });
});
