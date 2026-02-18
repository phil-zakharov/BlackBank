import { configureStore } from '@reduxjs/toolkit'
import { accountsSlice } from '../../domains/accounts/model/accountsSlice'
import { authSlice } from '../../domains/auth/model/authSlice'

export const store = configureStore({
  reducer: {
    accounts: accountsSlice.reducer,
    auth: authSlice.reducer,
  },
})


