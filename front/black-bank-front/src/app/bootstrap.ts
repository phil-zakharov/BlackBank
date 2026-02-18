import { configureHttpClient } from '../shared/api/httpClient';
import { store } from './store/store';
import { authApi } from '../domains/auth/api/authApi';
import { setAuth, clearAuth } from '../domains/auth/model/authSlice';

configureHttpClient({
  getAccessToken: () => store.getState().auth.accessToken,
  on401: async () => {
    try {
      const r = await authApi.refresh();
      const { user } = store.getState().auth;
      if (user) {
        store.dispatch(setAuth({ user, accessToken: r.accessToken }));
        return r.accessToken;
      }
      return null;
    } catch {
      store.dispatch(clearAuth());
      return null;
    }
  },
});
