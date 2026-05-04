import { ROUTES } from "@/constants/apiRoutes";
import { api } from "@/lib/axios";

export const AddExperience = async (data: any) => {
  const response = await api.post(ROUTES.MENTOR.EXPERIENCE.ROOT, data);
  return response.data;
};
