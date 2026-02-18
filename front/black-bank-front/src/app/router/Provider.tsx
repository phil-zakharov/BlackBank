import { createBrowserRouter } from 'react-router';
import { RouterProvider as RRProvider } from 'react-router/dom';
import { RootLayout } from '../layout/RootLayout';
import { HomePage } from '../../pages/home/HomePage';
import { CabinetPage } from '../../pages/cabinet/CabinetPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'cabinet', element: <CabinetPage /> },
    ],
  },
]);

export const RouterProvider = () => <RRProvider router={router} />;
