import { createBrowserRouter, Navigate } from "react-router";
import { Root } from "./App";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import SignupPage from "@/features/auth/pages/SignupPage";
import { VerifyEmailPage } from "@/features/auth/pages/VerifyEmailPage";
import verifyToken from "@/features/auth/helpers/verifyEmailLoder";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgetpasswordPage";
import {
  ResetPasswordPage,
  verifyTokenForResetPassword,
} from "@/features/auth/pages/resetPasswordPage";
import AuthLoader from "@/helpers/AuthLoader";
import MentorAdminUsers from "@/features/admin/pages/user";
import { AdminLoginPage } from "@/features/auth/pages/AdminLogin";
import { AdminRoot } from "@/components/adminRoot";
import { AdminRootLayout } from "@/layout/AdminLayout";
import AdminMentorPanel from "@/features/admin/pages/mentor";

export const router = createBrowserRouter([
  {
    path: "/",
    loader: AuthLoader,
    children: [
      {
        index: true,
        Component: Root,
      },

      {
        path: "/auth",
        Component: AuthLayout,
        children: [
          {
            index: true,
            element: <Navigate to="/auth/login" replace={true} />,
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
            id: "verify-email",
            loader: verifyToken,
            Component: VerifyEmailPage,
          },
          {
            path: "forget-password",
            Component: ForgotPasswordPage,
          },
          {
            path: "reset-password",
            loader: verifyTokenForResetPassword,
            Component: ResetPasswordPage,
          },
          {
            path: "admin/login",
            Component: AdminLoginPage,
          },
        ],
      },
      {
        path: "/admin",
        Component: AdminRootLayout,
        children: [
          {
            index: true,
            Component: AdminRoot,
          },
          {
            path: "users",
            Component: MentorAdminUsers,
          },
          {
            path: "mentors",
            Component: AdminMentorPanel,
          },
        ],
      },
    ],
  },
]);
