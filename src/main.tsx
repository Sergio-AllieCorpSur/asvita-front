// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import App from "./App";
import Dashboard from "./pages/Dashboard";         
import DataroomsPage from "./pages/DataroomsPage";
import ExplorerPage from "./pages/ExplorerPage";
import NewDataroomForm from "./components/datarooom"; 

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,              
    children: [
      { index: true, element: <Dashboard /> },
      { path: "datarooms", element: <DataroomsPage /> },
      { path: "d/:dataroomId", element: <ExplorerPage /> },
      { path: "d/:dataroomId/f/:folderId", element: <ExplorerPage /> },
      { path: "new", element: <NewDataroomForm /> },
      
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
