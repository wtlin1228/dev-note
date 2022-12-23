import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

// const HomePage = React.lazy(() => import('./pages/home'));
// const FirstPage = React.lazy(() => import('./pages/first'));
// const NotFoundPage = React.lazy(() => import('./pages/not-found'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Hello world!</div>,
  },
]);

const root = document.querySelector('#app');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
}
