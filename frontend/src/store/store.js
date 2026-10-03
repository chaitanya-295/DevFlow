import { configureStore } from '@reduxjs/toolkit';
import { devflowApi } from '../api/devflowApi';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [devflowApi.reducerPath]: devflowApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(devflowApi.middleware),
});
