import { ROUTES } from "@/constants/apiRoutes";
import { api } from "@/lib/axios";
import type { ExperienceFormData } from "../schemas/experience.schema";

export const AddExperience = async (data: ExperienceFormData) => {
  const response = await api.post(ROUTES.MENTOR.EXPERIENCE.ROOT, data);
  return response.data;
};
