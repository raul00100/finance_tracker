import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/parts/mainLayout";
import HomePage from "./components/pages/home/homeMain";
import Transaction from "./components/pages/addTransactions/transactionMain";
import Story from "./components/pages/transactionStory/storyMain";
import Statistics from "./components/pages/statistic/statisticMain";
import ErrorHandler from "./components/parts/errorHandler";
import "./index.css";

// import { ChakraProvider } from "@chakra-ui/react";

import { SharedProvider } from "./components/parts/shared";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorHandler />, // Use MainLayout as the parent route
    children: [
      { path: "/", element: <HomePage /> },
      { path: "transaction", element: <Transaction /> },
      { path: "story", element: <Story /> }, // Explicit route for /story
      { path: "statistic", element: <Statistics /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <ChakraProvider> */}
    <SharedProvider>
      <RouterProvider router={router} />
    </SharedProvider>
    {/* </ChakraProvider> */}
  </React.StrictMode>
);
