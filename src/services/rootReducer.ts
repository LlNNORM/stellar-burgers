import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredientsSlice';
import burgerConstructorReducer from './burgerConstructorSlice';
import feedsReducer from './feedsSlice';
import orderDetailsReducer from './orderDetailsSlice';
import userReducer from './userSlice';
import userOrdersReducer from './userOrdersSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  feeds: feedsReducer,
  orderDetails: orderDetailsReducer,
  user: userReducer,
  userOrders: userOrdersReducer
});
