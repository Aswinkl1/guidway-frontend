import { ROUTES } from "@/constants/apiRoutes";
import { api } from "@/lib/axios";
import type { ExperienceFormData } from "../schemas/experience.schema";
import type { EducationFormData } from "../schemas/education.schema";
import type { AchievementFormData } from "../schemas/achievement.schema";
import type { SkillEntry } from "../types/skill.types";

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

export const getMentorProfile = async () => {
  const response = await api.get(ROUTES.MENTOR.PROFILE.ROOT);
  return response.data;
};

export const getAllSkills = async () => {
  const response = await api.get(ROUTES.MENTOR.SKILL.ROOT);
  console.log(response.data);
  return response.data;
};

export const addOrUpdateMentorSkill = async (data: SkillEntry) => {
  const response = await api.put(
    `${ROUTES.MENTOR.SKILL.ROOT}/${data.skillId}`,
    data,
  );
  return response.data;
};

export const removeMentorSkill = async (id: string) => {
  const response = await api.delete(`${ROUTES.MENTOR.SKILL.ROOT}/${id}`);
  return response.data;
};
