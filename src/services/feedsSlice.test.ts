import reducer, { fetchFeeds } from './feedsSlice';
import type { TOrder } from '@utils-types';
import {
  selectFeedsOrders,
  selectFeedsTotal,
  selectFeedsTotalToday,
  selectFeedsLoading,
  selectFeedsError
} from './feedsSlice';
import type { RootState } from './store';

describe('reducers', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null
  };

  const mockOrder: TOrder = {
    _id: 'order1',
    ingredients: ['1', '2'],
    status: 'done',
    name: 'Test order',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
    number: 1
  };

  it('should handle fetchFeeds.pending', () => {
    const action = { type: fetchFeeds.pending.type };
    const state = reducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.orders).toEqual([]);
    expect(state.total).toBe(0);
    expect(state.totalToday).toBe(0);
  });

  it('should handle fetchFeeds.fulfilled', () => {
    const action = {
      type: fetchFeeds.fulfilled.type,
      payload: {
        orders: [mockOrder],
        total: 500,
        totalToday: 100
      }
    };
    const state = reducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.orders).toEqual([mockOrder]);
    expect(state.total).toBe(500);
    expect(state.totalToday).toBe(100);
    expect(state.error).toBeNull();
  });

  it('should handle fetchFeeds.rejected', () => {
    const action = {
      type: fetchFeeds.rejected.type,
      payload: 'Network error'
    };
    const state = reducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network error');
  });
});

describe('selectors', () => {
  const mockOrders: TOrder[] = [
    {
      _id: 'order123',
      ingredients: ['1', '2'],
      status: 'done',
      name: 'Test order',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
      number: 123
    }
  ];

  const mockState: RootState = {
    feeds: {
      orders: mockOrders,
      total: 1000,
      totalToday: 100,
      loading: true,
      error: 'Error occurred'
    },
    burgerConstructor: {} as any,
    ingredients: {} as any,
    orderDetails: {} as any,
    user: {} as any,
    userOrders: {} as any
  };

  it('selectFeedsOrders', () => {
    expect(selectFeedsOrders(mockState)).toEqual(mockOrders);
  });

  it('selectFeedsTotal', () => {
    expect(selectFeedsTotal(mockState)).toBe(1000);
  });

  it('selectFeedsTotalToday', () => {
    expect(selectFeedsTotalToday(mockState)).toBe(100);
  });

  it('selectFeedsLoading', () => {
    expect(selectFeedsLoading(mockState)).toBe(true);
  });

  it('selectFeedsError', () => {
    expect(selectFeedsError(mockState)).toBe('Error occurred');
  });
});
