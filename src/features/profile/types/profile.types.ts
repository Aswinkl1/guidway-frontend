export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "FREELANCE"
  | "SELF_EMPLOYED"
  | "VOLUNTEER";

export interface ExperienceFormData {
  role: string;
  company: string;
  employmentType: EmploymentType | "";
  startMonth: number | "";
  startYear: number | "";
  endMonth: number | "";
  endYear: number | "";
  isCurrent: boolean;
  description: string;
}

export interface EducationFormData {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startMonth: number | "";
  startYear: number | "";
  endMonth: number | "";
  endYear: number | "";
  isCurrent: boolean;
  grade: string;
  description: string;
}

export type ExperienceErrors = Partial<
  Record<keyof ExperienceFormData | "endDate", string>
>;
export type EducationErrors = Partial<
  Record<keyof EducationFormData | "endDate", string>
>;
