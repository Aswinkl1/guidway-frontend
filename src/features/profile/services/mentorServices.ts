import { ROUTES } from "@/constants/apiRoutes";
import { api } from "@/lib/axios";
import type {
  DeleteExperienceType,
  EditExperienceType,
  ExperienceFormData,
} from "../schemas/experience.schema";
import type {
  DeleteEducationType,
  EditEducationType,
  EducationFormData,
} from "../schemas/education.schema";
import type { AchievementFormData } from "../schemas/achievement.schema";
import type { SkillEntry } from "../types/skill.types";
import type { LanguageEntry } from "../types/language.types";
import type {
  CreateSocialLinkDTO,
  EditProfileDTO,
  EditProfileFormData,
  UpdateMentorOverviewDTO,
} from "../schemas/edit-profile.schema";

export const AddExperience = async (data: ExperienceFormData) => {
  const response = await api.post(ROUTES.MENTOR.EXPERIENCE.ROOT, data);
  return response.data;
};

export const EditExperience = async (data: EditExperienceType) => {
  const response = await api.put(
    `${ROUTES.MENTOR.EXPERIENCE.ROOT}/${data.id}`,
    data,
  );
  return response.data;
};

export const DeleteExperience = async (data: DeleteExperienceType) => {
  const response = await api.delete(
    `${ROUTES.MENTOR.EXPERIENCE.ROOT}/${data.id}`,
  );
  return response.data;
};
export const AddEducation = async (data: EducationFormData) => {
  const response = await api.post(ROUTES.MENTOR.EDUCATION.ROOT, data);
  return response.data;
};

export const EditEducation = async (data: EditEducationType) => {
  const response = await api.put(
    `${ROUTES.MENTOR.EDUCATION.ROOT}/${data.id}`,
    data,
  );
  return response.data;
};

export const DeleteEducation = async (data: DeleteEducationType) => {
  const response = await api.delete(
    `${ROUTES.MENTOR.EDUCATION.ROOT}/${data.id}`,
  );
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

export const getAllLanguages = async () => {
  const response = await api.get(ROUTES.MENTOR.LANGUAGE.ROOT);

  console.log(response.data);

  return response.data;
};

export const addOrUpdateMentorLanguage = async (data: LanguageEntry) => {
  const response = await api.put(
    `${ROUTES.MENTOR.LANGUAGE.ROOT}/${data.languageId}`,
    data,
  );

  return response.data;
};

export const removeMentorLanguage = async (id: string) => {
  const response = await api.delete(`${ROUTES.MENTOR.LANGUAGE.ROOT}/${id}`);

  return response.data;
};

export const getAllDomain = async () => {
  const response = await api.get(ROUTES.MENTOR.DOMAIN.ROOT);
  console.log(response.data);
  return response.data;
};

const _editUserProfile = async (data: EditProfileDTO) => {
  console.log("user  data ", data);
  const response = await api.patch(`${ROUTES.USER.DETAIL}`, data);
  console.log("resonsonco");
  console.log(response);
  return response.data;
};

const _editMentorOverview = async (data: UpdateMentorOverviewDTO) => {
  const response = await api.patch(ROUTES.MENTOR.PROFILE.ROOT, data);
  return response.data;
};

const _editSocialLinks = async (data: CreateSocialLinkDTO) => {
  const response = await api.put(ROUTES.MENTOR.SOCIALMEDIA_LINKS.ROOT, data);
  return response.data;
};

// ─── Combined ─────────────────────────────────────────────────────────────────

export const EditProfile = async (data: EditProfileFormData) => {
  console.log("jjdfkjldkfljdklf");
  const profile: EditProfileDTO = {
    name: data.name,
    phoneNumber: data.phoneNumber,
    timezone: data.timezone,
  };

  const overview: UpdateMentorOverviewDTO = {
    shortBio: data.shortBio,
    headline: data.headline,
    domainId: data.domainId,
  };

  const links: CreateSocialLinkDTO = {
    links: data.links,
  };

  const [profileResult, overviewResult, linksResult] = await Promise.all([
    _editUserProfile(profile),
    _editMentorOverview(overview),
    _editSocialLinks(links),
  ]);

  return { profileResult, overviewResult, linksResult };
};
