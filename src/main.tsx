import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import App from "./App"; // layout (sidebar + topbar + footer)
import DataroomsPage from "./pages/DataroomsPage";
import ExplorerPage from "./pages/ExplorerPage";
import DashboardPage from "./pages/Dashboard"; // <-- crea este archivo con lo que te pasé antes

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App envuelve el layout
    children: [
      // Home → dashboard tipo analytics
      { index: true, element: <DashboardPage /> },

      // Rutas de Datarooms
      { path: "datarooms", element: <DataroomsPage /> },

      // Explorador de carpetas/archivos
      { path: "d/:dataroomId", element: <ExplorerPage /> },
      { path: "d/:dataroomId/f/:folderId", element: <ExplorerPage /> },
    ],
  },
]);

// React Query client
const qc = new QueryClient();

// Render
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
