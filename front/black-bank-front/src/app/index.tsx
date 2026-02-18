import './bootstrap';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { compareContext } from '../shared/utils/react/compareContext.tsx';
import { StoreProvider } from './store/Provider.tsx';
import { RouterProvider } from './router/Provider.tsx';
import { ApiProvider } from './api/Provider.tsx';
import { UIProvider } from './ui/Provider.tsx';

createRoot(document.getElementById('root')!).render(
  compareContext(StrictMode, StoreProvider, ApiProvider, UIProvider, RouterProvider)
)
