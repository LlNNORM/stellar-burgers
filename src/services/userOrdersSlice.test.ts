import reducer, {
  fetchUserOrders,
  clearUserOrders,
  selectUserOrders,
  selectUserOrdersLoading,
  selectUserOrdersError
} from './userOrdersSlice';

import type { TOrder } from '@utils-types';
import type { RootState } from './store';

describe('reducers', () => {
  const initialState = {
    orders: [],
    loading: false,
    error: null
  };

  const mockOrder: TOrder = {
    _id: 'order123',
    ingredients: ['id1', 'id2'],
    status: 'done',
    name: 'Test Order',
    createdAt: '2025-06-01T00:00:00.000Z',
    updatedAt: '2025-06-01T01:00:00.000Z',
    number: 777
  };

  it('should handle fetchUserOrders.pending', () => {
    const action = { type: fetchUserOrders.pending.type };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchUserOrders.fulfilled', () => {
    const action = {
      type: fetchUserOrders.fulfilled.type,
      payload: [mockOrder]
    };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.orders).toEqual([mockOrder]);
  });

  it('should handle fetchUserOrders.rejected', () => {
    const action = {
      type: fetchUserOrders.rejected.type,
      payload: 'Fetch failed'
    };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Fetch failed');
  });

  it('should handle clearUserOrders', () => {
    const preloadedState = {
      orders: [mockOrder],
      loading: true,
      error: 'Some error'
    };
    const state = reducer(preloadedState, clearUserOrders());
    expect(state).toEqual(initialState);
  });
});
describe('selectors', () => {
  const mockOrders: TOrder[] = [
    {
      _id: 'order123',
      ingredients: ['id1', 'id2'],
      status: 'done',
      name: 'Test Order',
      createdAt: '2025-06-01',
      updatedAt: '2025-06-01',
      number: 123
    }
  ];

  const mockState: RootState = {
    userOrders: {
      orders: mockOrders,
      loading: true,
      error: 'Request failed'
    },
    ingredients: {} as any,
    burgerConstructor: {} as any,
    feeds: {} as any,
    orderDetails: {} as any,
    user: {} as any
  };

  it('selectUserOrders', () => {
    expect(selectUserOrders(mockState)).toEqual(mockOrders);
  });

  it('selectUserOrdersLoading', () => {
    expect(selectUserOrdersLoading(mockState)).toBe(true);
  });

  it('selectUserOrdersError', () => {
    expect(selectUserOrdersError(mockState)).toBe('Request failed');
  });
});
