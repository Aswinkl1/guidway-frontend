import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App.tsx";
import { RouterProvider } from "react-router";
import { router } from "./app/routes";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./app/store/store";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
// import { getUsers } from "./services/admin/adminServices";
// getUsers();
const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
      <Toaster />
    </Provider>
  </StrictMode>,
);
