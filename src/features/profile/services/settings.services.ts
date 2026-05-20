import { api } from "@/lib/axios";
import type {
  BookingRulePayload,
  UpdateVisibilityDTO,
} from "../types/settings.types";
import { ROUTES } from "@/constants/apiRoutes";
import type { ChangePasswordFormData } from "../schemas/resetPassword.schema";

export const mentorStatusChanege = async (data: UpdateVisibilityDTO) => {
  const response = await api.patch(ROUTES.MENTOR.SETTINGS.STATUS, data);
  return response.data;
};

export const mentorBookingRules = async (data: BookingRulePayload) => {
  const response = await api.patch(ROUTES.MENTOR.SETTINGS.BOOKINGRULES, data);
  return response.data;
};

export const resetPassword = async (
  data: Omit<ChangePasswordFormData, "confirmPassword">,
) => {
  const response = await api.patch(
    ROUTES.MENTOR.SETTINGS.CHANGE_PASSWORD,
    data,
  );
  console.log(response);
  return response.data;
};

export const getSettings = async () => {
  const response = await api.get(ROUTES.MENTOR.SETTINGS.ROOT);
  return response.data;
};
