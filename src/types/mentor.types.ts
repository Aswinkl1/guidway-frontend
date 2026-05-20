import type { EmploymentType } from "@/features/profile/types/profile.types";
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
