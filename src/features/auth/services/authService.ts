import { api } from "@/lib/axios";
import type { SignupPayload } from "../components/Signup";
import type { LoginPayload } from "../components/Login";
import type { forgetPasswordPayload } from "../pages/ForgetpasswordPage";
import type { ResetPasswordPayload } from "../components/ResetPassword";
import { ROUTES } from "@/constants/apiRoutes";

export const userLogin = async (data: LoginPayload) => {
  const response = await api.post(ROUTES.AUTH.LOGIN, data);
  return response.data;
};

export const userSignup = async (data: SignupPayload) => {
  const response = await api.post(ROUTES.AUTH.SIGNUP, data);
  return response.data;
};

export const forgetPassword = async (data: forgetPasswordPayload) => {
  const response = await api.post(ROUTES.AUTH.FORGET_PASSWORD, data);
  return response.data;
};

export const adminLogin = async (data: LoginPayload) => {
  const response = await api.post(ROUTES.AUTH.ADMIN_LOGIN, data);
  return response.data;
};

export const resetPassword = async (
  data: Omit<ResetPasswordPayload, "confirmPassword"> & { token: string },
) => {
  const response = await api.patch(ROUTES.AUTH.RESET_PASSWORD, data);
  return response.data;
};

export const logout = async () => {
  const response = await api.post(ROUTES.AUTH.LOGOUT);
  return response.data.result;
};
