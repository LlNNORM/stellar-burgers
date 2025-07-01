import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredientsSlice';
import burgerConstructorReducer from './burgerConstructorSlice';
import feedsReducer from './feedsSlice';
import orderDetailsReducer from './orderDetailsSlice';
import userReducer from './userSlice';
import userOrdersReducer from './userOrdersSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  feeds: feedsReducer,
  orderDetails: orderDetailsReducer,
  user: userReducer,
  userOrders: userOrdersReducer
});

describe('rootReducer', () => {
  it('should initialize correctly', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('feeds');
    expect(state).toHaveProperty('orderDetails');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('userOrders');
    jest.mock('../utils/storage', () => ({
      loadUserFromStorage: jest.fn(() => null)
    }));

    expect(state.ingredients).toEqual({
      items: [],
      loading: false,
      error: null
    });
    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: [],
      orderRequest: false,
      orderModalData: null,
      error: null
    });
    expect(state.feeds).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      loading: false,
      error: null
    });
    expect(state.orderDetails).toEqual({
      data: null,
      loading: false,
      error: null
    });
    expect(state.user).toEqual({
      user: null,
      loading: false,
      error: null,
      isLoggedIn: false
    });
    expect(state.userOrders).toEqual({
      orders: [],
      loading: false,
      error: null
    });
  });
});
