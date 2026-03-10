import { createBrowserRouter, Navigate } from "react-router";
import { Root } from "./App";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import SignupPage from "@/features/auth/pages/SignupPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
  },
  {
    path: "/auth",
    Component: AuthLayout,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" replace />,
      },
      {
        path: "login",
        Component: LoginPage,
      },
      {
        path: "signup",
        Component: SignupPage,
      },
    ],
  },
]);
