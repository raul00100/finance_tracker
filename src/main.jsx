import React from 'react';
import ReactDOM from 'react-dom/client';
//import Test from './components/parts/test'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './components/parts/mainLayout'; // Import the layout component
import HomePage from './components/pages/home_page';
import Transaction from './components/pages/transaction';
import Story from './components/pages/story';
import Statistics from './components/pages/statistic';
import ErrorHandler from './components/parts/errorHandler';
import './index.css'

import { SharedProvider } from './components/parts/shared';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, 
    errorElement: <ErrorHandler />,// Use MainLayout as the parent route
    children: [
      { path: '/', element: <HomePage />},
      { path: 'transaction', element: <Transaction /> },
      { path: 'story', element: <Story /> }, // Explicit route for /story
      { path: 'statistic', element: <Statistics /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SharedProvider>
      <RouterProvider router={router} />
    </SharedProvider>
  </React.StrictMode>
  // <React.StrictMode>
  //   <Test></Test>
  // </React.StrictMode>
);