import { ROUTES } from "@/constants/apiRoutes";
import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/apiResponse";

export const addAvailability = async (data: any) => {
  const response = await api.post<ApiResponse<void>>(
    ROUTES.MENTOR.AVAILABILITY.ROOT,
    data,
  );
  return response.data.result;
};

export const getAvailability = async () => {
  const response = await api.get(ROUTES.MENTOR.AVAILABILITY.ROOT);
  console.log(response.data.result);
  return response.data.result;
};

export const deleteAvailability = async (id: string) => {
  const response = await api.delete<ApiResponse<void>>(
    `${ROUTES.MENTOR.AVAILABILITY.ROOT}/${id}`,
  );
  return response.data.result;
};

export const toggleAvailability = async (data: {
  dayOfWeek: string;
  isActive: boolean;
}) => {
  const response = await api.patch<ApiResponse<void>>(
    ROUTES.MENTOR.AVAILABILITY.ROOT,
    data,
  );
  return response.data.result;
};
