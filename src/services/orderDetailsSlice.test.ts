import reducer, {
    fetchOrderDetails,
    clearOrderDetails,
    selectOrderData,
    selectOrderLoading,
    selectOrderError
  } from './orderDetailsSlice';
  import type { TOrder } from '@utils-types';
  import type { RootState } from './store';

  describe('reducers', () => {
    const initialState = {
      data: null,
      loading: false,
      error: null
    };
  
    const mockOrder: TOrder = {
      _id: 'order1',
      ingredients: ['id1', 'id2'],
      status: 'done',
      name: 'Burger order',
      createdAt: '2025-06-01T00:00:00.000Z',
      updatedAt: '2025-06-01T01:00:00.000Z',
      number: 42
    };
  
    it('should handle fetchOrderDetails.pending', () => {
      const action = { type: fetchOrderDetails.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.data).toBeNull();
    });
  
    it('should handle fetchOrderDetails.fulfilled', () => {
      const action = {
        type: fetchOrderDetails.fulfilled.type,
        payload: mockOrder
      };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.data).toEqual(mockOrder);
      expect(state.error).toBeNull();
    });
  
    it('should handle fetchOrderDetails.rejected', () => {
      const action = {
        type: fetchOrderDetails.rejected.type,
        payload: 'Order not found'
      };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Order not found');
    });
  
    it('should handle clearOrderDetails', () => {
      const modifiedState = {
        data: mockOrder,
        loading: true,
        error: 'Something went wrong'
      };
      const action = clearOrderDetails();
      const state = reducer(modifiedState, action);
      expect(state).toEqual(initialState);
    });
  });
  describe('selectors', () => {
    const mockOrder: TOrder = {
        _id: 'order1',
        ingredients: ['1', '2'],
        status: 'done',
        name: 'Test order',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        number: 1
      };
  
    const mockState: RootState = {
      orderDetails: {
        data: mockOrder,
        loading: true,
        error: 'Failed to fetch'
      },
      ingredients: {} as any,
      burgerConstructor: {} as any,
      feeds: {} as any,
      user: {} as any,
      userOrders: {} as any
    };
  
    it('selectOrderData', () => {
      expect(selectOrderData(mockState)).toEqual(mockOrder);
    });
  
    it('selectOrderLoading', () => {
      expect(selectOrderLoading(mockState)).toBe(true);
    });
  
    it('selectOrderError', () => {
      expect(selectOrderError(mockState)).toBe('Failed to fetch');
    });
  });
  