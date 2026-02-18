import { createSlice } from '@reduxjs/toolkit';
import type { Account } from './types';

const initialState: Account[] = [];

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    addAccount: (state, action: { payload: Account }) => {
      state.push(action.payload);
    },
    removeAccount: (state, action: { payload: string }) => {
      return state.filter((a) => a.id !== action.payload);
    },
  },
});

export const { addAccount, removeAccount } = accountsSlice.actions;
