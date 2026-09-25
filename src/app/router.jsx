import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import RequestsPage from "../features/requests/pages/RequestsPage";
import RequestDetailsPage from "../features/requests/pages/RequestDetailsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/requests" replace />,
      },
      {
        path: "requests",
        element: <RequestsPage />,
      },
      {
        path: "requests/:id",
        element: <RequestDetailsPage />,
      },
    ],
  },
]);
