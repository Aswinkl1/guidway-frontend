import { ROUTES } from "@/constants/apiRoutes";
import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/apiResponse";
import type { BookingSetupDetailsOutput } from "../types/booking.types";

export const getSlots = async (mentorId: string, date: string) => {
  console.log("jkdfkladjlk");
  const response = await api.get(
    `${ROUTES.MENTOR.ROOT}/${mentorId}/slots?date=${date}`,
  );
  console.log(response.data.result);
  return response.data.result;
};

export const getBookingSetupDetails = async (
  mentorId: string,
  sessionId: string,
) => {
  console.log(mentorId, sessionId, "mentorId, sessionId");
  const response = await api.get<ApiResponse<BookingSetupDetailsOutput>>(
    `${ROUTES.MENTOR.ROOT}/${mentorId}/session/${sessionId}/`,
  );
  return response.data.result;
};
