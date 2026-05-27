import type { ReactNode } from "react";

export interface NavItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
}

export interface StatBadgeProps {
  icon: ReactNode;
  value: string;
  label: string;
  colorClass: string;
}

export interface SectionCardProps {
  title: string;
  actionLabel?: ReactNode;
  onAction?: () => void;
  children: ReactNode;
}

export interface SkillTagProps {
  label: string;
}

export interface LanguageTagProps {
  lang: string;
  level: string;
}

export interface WorkEntryProps {
  id: string;
  role: string;
  company: string;
  employmentType: EmploymentType;
  startMonth: number;
  startYear: number;
  endMonth: number | null;
  endYear: number | null;
  isCurrent: boolean;
  description: string | null;
  showActions?: boolean;
}

export interface AwardEntryProps {
  id: string;
  title: string;
  type: string;
  year: string;
  showActions?: boolean;
}

export interface EducationEntryProps {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startMonth: number;
  startYear: number;
  endMonth: number | null;
  endYear: number | null;
  isCurrent: boolean;
  grade: string | null;
  description: string | null;
  showActions?: boolean;
}

export interface QuickActionRowProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  handler: () => void;
}

export interface VisibilityToggleProps {
  label: string;
  subtitle: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

export const AchievementType = {
  AWARD: "AWARD",
  CERTIFICATION: "CERTIFICATION",
  COMPETITION: "COMPETITION",
  PUBLICATION: "PUBLICATION",
  SPEAKING: "SPEAKING",
  HACKATHON_WIN: "HACKATHON_WIN",
  SCHOLARSHIP: "SCHOLARSHIP",
  WORK_RECOGNITION: "WORK_RECOGNITION",
  OTHER: "OTHER",
} as const;

export type AchievementType =
  (typeof AchievementType)[keyof typeof AchievementType];

export const EmploymentType = {
  FULL_TIME: "FULL_TIME",
  PART_TIME: "PART_TIME",
  SELF_EMPLOYED: "SELF_EMPLOYED",
  FREELANCE: "FREELANCE",
  INTERNSHIP: "INTERNSHIP",
  CONTRACT: "CONTRACT",
} as const;

export type EmploymentType =
  (typeof EmploymentType)[keyof typeof EmploymentType];

export const MentorStatus = {
  PENDING: "PENDING_REVIEW",
  ACTIVE: "ACTIVE",
  DRAFT: "DRAFT",
  PAUSED: "PAUSED",
  SUSPENDED: "SUSPENDED",
} as const;

export type MentorStatus = (typeof MentorStatus)[keyof typeof MentorStatus];
export interface MentorProfileType {
  userId: string;
  name: string;
  email: string;
  profileImageKey: string | null;
  timezone: string | null;

  status: MentorStatus;
  isVerified: boolean;
  headline: string | null;
  shortBio: string | null;
  averageRating: number;
  reviewCount: number;
  domain: { id: string; name: string } | null;

  socialLinks: {
    // platform: SocialPlatform;
    // TODO change this to socailaplatoform from domian
    platform: string;

    url: string;
  }[];

  languages: {
    languageId: string;
    name: string;
    code: string;
    // proficiency: ProficiencyLevel;
    //TODO change this to proficiencyLevel from domain
    proficiency: string;
  }[];

  skills: {
    skillId: string;
    name: string;
    yearsExperience: number | null;
  }[];

  experiences: {
    id: string;
    role: string;
    company: string;
    employmentType: EmploymentType;
    startMonth: number;
    startYear: number;
    endMonth: number | null;
    endYear: number | null;
    isCurrent: boolean;
    description: string | null;
  }[];

  education: {
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startMonth: number;
    startYear: number;
    endMonth: number | null;
    endYear: number | null;
    isCurrent: boolean;
    grade: string | null;
    description: string | null;
  }[];

  achievements: {
    id: string;
    title: string | null;
    type: AchievementType;
    year: number | null;
  }[];
  sessions: {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
  }[];
}
