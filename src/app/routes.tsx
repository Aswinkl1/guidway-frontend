import { createBrowserRouter, Navigate } from "react-router";
import { Root } from "./App";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import SignupPage from "@/features/auth/pages/SignupPage";
import { VerifyEmailPage } from "@/features/auth/pages/VerifyEmailPage";
import verifyToken from "@/features/auth/helpers/verifyEmailLoder";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgetpasswordPage";
import { ResetPasswordPage } from "@/features/auth/pages/resetPasswordPage";

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
      {
        path: "verify",
        loader: verifyToken,
        Component: VerifyEmailPage,
      },
      {
        path: "forget-password",
        Component: ForgotPasswordPage,
      },
      {
        path: "reset-password",
        Component: ResetPasswordPage,
      },
    ],
  },
]);
