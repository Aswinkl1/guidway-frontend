import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/apiResponse";
import type { AdminBookingDetailsOutput } from "../types/adminBooking.types";

export const getAdminBookingDetails = async (id: string) => {
  const response = await api.get<ApiResponse<AdminBookingDetailsOutput>>(
    "/api/v1/admin/booking/" + id,
  );
  return response.data.result;
};
