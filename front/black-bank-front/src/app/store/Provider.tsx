import type { PropsWithChildren } from 'react';
import { store } from './store';
import { Provider } from 'react-redux';

export const StoreProvider = ({ children }: PropsWithChildren) => (
  <Provider store={store}>{children}</Provider>
);
