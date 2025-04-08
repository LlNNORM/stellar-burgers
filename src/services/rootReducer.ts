import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredientsSlice';
import burgerConstructorReducer from './burgerConstructorSlice';
import feedsReducer from './feedsSlice';
import orderDetailsReducer from './orderDetailsSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  feeds: feedsReducer,
  orderDetails: orderDetailsReducer
});
