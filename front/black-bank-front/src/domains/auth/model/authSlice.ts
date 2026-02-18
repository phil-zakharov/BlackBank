import { createSlice } from '@reduxjs/toolkit';
import type { AuthUser } from './types';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (
      state,
      action: { payload: { user: AuthUser; accessToken: string } }
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
