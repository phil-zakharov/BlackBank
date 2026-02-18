import { createBrowserRouter } from "react-router";
import { RouterProvider as RRProvider } from "react-router/dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello World</div>,
  },
]);

export const RouterProvider = () => <RRProvider router={router} />
