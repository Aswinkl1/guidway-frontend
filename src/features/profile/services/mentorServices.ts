import { ROUTES } from "@/constants/apiRoutes";
import { api } from "@/lib/axios";
import type { ExperienceFormData } from "../schemas/experience.schema";
import type { EducationFormData } from "../schemas/education.schema";
import type { AchievementFormData } from "../schemas/achievement.schema";

export const AddExperience = async (data: ExperienceFormData) => {
  const response = await api.post(ROUTES.MENTOR.EXPERIENCE.ROOT, data);
  return response.data;
};

export const AddEducation = async (data: EducationFormData) => {
  const response = await api.post(ROUTES.MENTOR.EDUCATION.ROOT, data);
  return response.data;
};

export const AddAchievement = async (data: AchievementFormData) => {
  const response = await api.post(ROUTES.MENTOR.ACHIEVEMENT.ROOT, data);
  return response.data;
};
