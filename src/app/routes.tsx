import { createBrowserRouter, Navigate } from "react-router";
import { CLIENT_ROUTES } from "@/constants/clientRoutes";

// import { Root } from "./App";
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
import AdminUsersPanel from "@/features/admin/pages/user";
import { AdminLoginPage } from "@/features/auth/pages/AdminLogin";
import { AdminRoot } from "@/components/adminRoot";
import { AdminRootLayout } from "@/layout/AdminLayout";
import AdminMentorPanel from "@/features/admin/pages/mentor";
import GuidWayHomePage from "@/pages/homePage";
import MentorProfilePage from "@/features/profile/pages/MentorProfilePage";
import { MentorLayout } from "@/features/profile/components/MentorLayout";
import MentorSettingsPage from "@/features/profile/pages/MentorSettings.page";
import MentorSessionsPage from "@/features/session/pages/mentorSessionPage";
import { NotFoundPage } from "@/components/shared/Eroor/NotFoundError";
import { ServerErrorPage } from "@/components/shared/Eroor/ServerError";
import { ErrorNavigator } from "@/components/ErrorNavigator";
import AdminMentorProfilePage from "@/features/admin/pages/adminMentorProfile";
import MentorListingPage from "@/features/mentor/pages/MentorListingPage";
import MentorPublicProfilePage from "@/features/mentor/pages/MentorDetailsPage";
import AvailabilityPage from "@/features/mentor/pages/AvailabilityPage";

export const router = createBrowserRouter([
  {
    path: CLIENT_ROUTES.MENTOR.ROOT,
    Component: MentorListingPage,
  },
  {
    path: CLIENT_ROUTES.MENTOR.DETAILS,
    Component: MentorPublicProfilePage,
  },
  {
    path: CLIENT_ROUTES.HOME,
    loader: AuthLoader,
    Component: ErrorNavigator,
    children: [
      {
        index: true,
        Component: GuidWayHomePage,
      },

      {
        path: CLIENT_ROUTES.AUTH.ROOT,
        Component: AuthLayout,
        children: [
          {
            index: true,
            element: <Navigate to={CLIENT_ROUTES.AUTH.LOGIN} replace={true} />,
          },
          {
            path: CLIENT_ROUTES.AUTH.LOGIN,
            Component: LoginPage,
          },
          {
            path: CLIENT_ROUTES.AUTH.SIGNUP,
            Component: SignupPage,
          },
          {
            path: CLIENT_ROUTES.AUTH.VERIFY,
            id: "verify-email",
            loader: verifyToken,
            Component: VerifyEmailPage,
          },
          {
            path: CLIENT_ROUTES.AUTH.FORGET_PASSWORD,
            Component: ForgotPasswordPage,
          },
          {
            path: CLIENT_ROUTES.AUTH.RESET_PASSWORD,
            loader: verifyTokenForResetPassword,
            Component: ResetPasswordPage,
          },
          {
            path: CLIENT_ROUTES.AUTH.ADMIN_LOGIN,
            Component: AdminLoginPage,
          },
        ],
      },
      {
        path: CLIENT_ROUTES.MENTOR.ROOT,
        Component: MentorLayout,
        children: [
          {
            path: CLIENT_ROUTES.MENTOR.PROFILE,
            Component: MentorProfilePage,
          },
          {
            path: CLIENT_ROUTES.MENTOR.SETTINGA,
            Component: MentorSettingsPage,
          },
          {
            path: CLIENT_ROUTES.MENTOR.SESSIONS,
            Component: MentorSessionsPage,
          },
          {
            path: "/mentor/availability",
            Component: AvailabilityPage,
          },
        ],
      },

      {
        path: CLIENT_ROUTES.ADMIN.ROOT,
        Component: AdminRootLayout,
        children: [
          {
            index: true,
            Component: AdminRoot,
          },
          {
            path: CLIENT_ROUTES.ADMIN.USERS,
            Component: AdminUsersPanel,
          },
          {
            path: CLIENT_ROUTES.ADMIN.MENTORS,
            Component: AdminMentorPanel,
          },
          {
            path: "/admin/mentor/:id",
            Component: AdminMentorProfilePage,
          },
        ],
      },
      {
        path: "*",
        Component: NotFoundPage,
      },
      {
        path: "/500",
        Component: ServerErrorPage,
      },
    ],
  },
]);
