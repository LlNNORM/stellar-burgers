import reducer, {
    resetUser,
    loginUser,
    registerUser,
    fetchCurrentUser,
    updateUser,
    logoutUser,
  } from './userSlice';
  
  import type { TUser } from '../utils/types';
  jest.mock('../utils/storage', () => ({
    loadUserFromStorage: jest.fn(() => null),
    saveUserToStorage: jest.fn(),
    clearUserFromStorage: jest.fn()
  }));
  import {
    selectUser,
    selectIsLoggedIn,
    selectUserLoading,
    selectUserError,
  } from './userSlice';
  import type { RootState } from './store';
  
  describe('reducer', () => {
    const mockUser: TUser = {
      name: 'Ivan',
      email: 'ivan@example.com',
    };
  
    const initialState = {
      user: null,
      loading: false,
      error: null,
      isLoggedIn: false,
    };
  
    it('should handle loginUser.pending', () => {
      const action = { type: loginUser.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  
    it('should handle loginUser.fulfilled', () => {
      const action = { type: loginUser.fulfilled.type, payload: mockUser };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isLoggedIn).toBe(true);
    });
  
    it('should handle loginUser.rejected', () => {
      const action = {
        type: loginUser.rejected.type,
        payload: 'Login failed',
      };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Login failed');
    });
  
    it('should handle registerUser.fulfilled', () => {
      const action = { type: registerUser.fulfilled.type, payload: mockUser };
      const state = reducer(initialState, action);
      expect(state.user).toEqual(mockUser);
      expect(state.isLoggedIn).toBe(true);
    });
  
    it('should handle fetchCurrentUser.fulfilled', () => {
      const action = { type: fetchCurrentUser.fulfilled.type, payload: mockUser };
      const state = reducer(initialState, action);
      expect(state.user).toEqual(mockUser);
      expect(state.isLoggedIn).toBe(true);
    });
  
    it('should handle fetchCurrentUser.rejected', () => {
      const action = {
        type: fetchCurrentUser.rejected.type,
        payload: 'Not authorized',
      };
      const state = reducer(initialState, action);
      expect(state.error).toBe('Not authorized');
      expect(state.isLoggedIn).toBe(false);
    });
  
    it('should handle updateUser.fulfilled', () => {
      const startState = {
        ...initialState,
        user: { name: 'Old', email: 'old@example.com' },
      };
      const updatedUser = { name: 'New', email: 'new@example.com' };
      const action = { type: updateUser.fulfilled.type, payload: updatedUser };
      const state = reducer(startState, action);
      expect(state.user).toEqual(updatedUser);
    });
  
    it('should handle updateUser.rejected', () => {
      const action = {
        type: updateUser.rejected.type,
        payload: 'Update failed',
      };
      const state = reducer(initialState, action);
      expect(state.error).toBe('Update failed');
    });
  
    it('should handle logoutUser.fulfilled', () => {
      const startState = {
        user: mockUser,
        loading: true,
        error: 'Some error',
        isLoggedIn: true,
      };
      const action = { type: logoutUser.fulfilled.type };
      const state = reducer(startState, action);
      expect(state.user).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isLoggedIn).toBe(false);
    });
  
    it('should handle resetUser', () => {
      const modifiedState = {
        user: mockUser,
        loading: true,
        error: 'some error',
        isLoggedIn: true,
      };
      const state = reducer(modifiedState, resetUser());
      expect(state.user).toBeNull();
      expect(state.error).toBeNull();
      expect(state.loading).toBe(false);
    });
  });
  describe('selectors', () => {
    const mockState: RootState = {
      user: {
        user: { name: 'Ivan', email: 'ivan@example.com' },
        loading: false,
        error: null,
        isLoggedIn: true,
      },
      ingredients: {} as any,
      burgerConstructor: {} as any,
      feeds: {} as any,
      orderDetails: {} as any,
      userOrders: {} as any,
    };
  
    it('selectUser', () => {
      expect(selectUser(mockState)).toEqual({
        name: 'Ivan',
        email: 'ivan@example.com',
      });
    });
  
    it('selectIsLoggedIn', () => {
      expect(selectIsLoggedIn(mockState)).toBe(true);
    });
  
    it('selectUserLoading', () => {
      expect(selectUserLoading(mockState)).toBe(false);
    });
  
    it('selectUserError', () => {
      expect(selectUserError(mockState)).toBeNull();
    });
  });