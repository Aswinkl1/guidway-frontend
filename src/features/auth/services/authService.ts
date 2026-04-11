import { api } from "@/lib/axios";
import type { SignupPayload } from "../components/Signup";
import type { LoginPayload } from "../components/Login";
import type { forgetPasswordPayload } from "../pages/ForgetpasswordPage";
import type { ResetPasswordPayload } from "../components/ResetPassword";

export const userLogin = async (data: LoginPayload) => {
  const response = await api.post("/login", data);
  return response.data;
};

export const userSignup = async (data: SignupPayload) => {
  const response = await api.post("/signup", data);
  return response.data;
};

export const forgetPassword = async (data: forgetPasswordPayload) => {
  const response = await api.post("/forget-password", data);
  return response.data;
};

export const adminLogin = async (data: LoginPayload) => {
  const response = await api.post(`/admin/login`, data);
  return response.data;
};

export const resetPassword = async (
  data: Omit<ResetPasswordPayload, "confirmPassword"> & { token: string },
) => {
  const response = await api.patch("/reset-password", data);
  return response.data;
};
