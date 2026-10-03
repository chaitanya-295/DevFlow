import { createSlice } from '@reduxjs/toolkit';

const initialToken = localStorage.getItem('devflow_token');
const initialUser = localStorage.getItem('devflow_user')
  ? JSON.parse(localStorage.getItem('devflow_user'))
  : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: initialToken,
    user: initialUser,
    isAuthenticated: !!initialToken,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      localStorage.setItem('devflow_token', token);
      localStorage.setItem('devflow_user', JSON.stringify(user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('devflow_token');
      localStorage.removeItem('devflow_user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
