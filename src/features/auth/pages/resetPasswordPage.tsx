import { useLoaderData, useNavigate } from "react-router";
import { LinkExpiredPage } from "../components/LinkExpiredPage";

import { isTokenValid } from "../helpers/verifyEmailLoder";
import {
  ResetPassword,
  type ResetPasswordPayload,
} from "../components/ResetPassword";
import toast from "react-hot-toast";
import { resetPassword } from "../services/authService";
import { CLIENT_ROUTES } from "@/constants/clientRoutes";

// helper loder function
export async function verifyTokenForResetPassword({
  request,
}: {
  request: Request;
}) {
  try {
    const url = new URL(request.url);

    const token = url.searchParams.get("token");
    if (!token) {
      return null;
    }

    if (isTokenValid(token)) {
      return token;
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const token = useLoaderData();
  console.log(token);

  async function onSubmit(data: Omit<ResetPasswordPayload, "confirmPassword">) {
    try {
      const paylod = { password: data.password, token };
      await resetPassword(paylod);
      toast.success("password changed successfully");
      await new Promise((res) => setTimeout(res, 2000));
      navigate(CLIENT_ROUTES.AUTH.LOGIN);
    } catch (error) {
      throw error;
    }
  }
  if (!token) return <LinkExpiredPage />;
  return <ResetPassword onSubmit={onSubmit} />;
}
