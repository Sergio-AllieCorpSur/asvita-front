import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import DataroomsPage from "./pages/DataroomsPage";
import ExplorerPage from "./pages/ExplorerPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <DataroomsPage /> },
      { path: "d/:dataroomId", element: <ExplorerPage /> },
      { path: "d/:dataroomId/f/:folderId", element: <ExplorerPage /> },
    ],
  },
]);

const qc = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
