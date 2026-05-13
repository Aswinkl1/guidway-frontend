import { api } from "@/lib/axios";
import type {
  BookingRulePayload,
  UpdateVisibilityDTO,
} from "../types/settings.types";
import { ROUTES } from "@/constants/apiRoutes";

export const mentorStatusChanege = async (data: UpdateVisibilityDTO) => {
  const response = await api.patch(ROUTES.MENTOR.SETTINGS.STATUS, data);
  return response.data;
};

export const mentorBookingRules = async (data: BookingRulePayload) => {
  const response = await api.patch(ROUTES.MENTOR.SETTINGS.BOOKINGRULES, data);
  return response.data;
};
