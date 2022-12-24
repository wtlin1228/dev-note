import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

import Layout from './Layout';

const HomePage = React.lazy(() => import('./pages/Home'));
const AboutPage = React.lazy(() => import('./pages/About'));
const FirstPage = React.lazy(() => import('./pages/First'));
const SecondPage = React.lazy(() => import('./pages/Second'));
const NotFoundPage = React.lazy(() => import('./pages/NotFound'));

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <HomePage />
      </Layout>
    ),
  },
  {
    path: '/about',
    element: (
      <Layout>
        <AboutPage />
      </Layout>
    ),
  },
  {
    path: '/first',
    element: (
      <Layout>
        <FirstPage />
      </Layout>
    ),
  },
  {
    path: '/second',
    element: (
      <Layout>
        <SecondPage />
      </Layout>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
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
