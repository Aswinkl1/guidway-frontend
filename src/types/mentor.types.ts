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
  company: string;
  role: string;
  period: string;
  duration: string;
}

export interface AwardEntryProps {
  title: string;
  type: string;
  year: string;
}

export interface EducationEntryProps {
  school: string;
  degree: string;
  years: string;
  gpa: string;
}

export interface QuickActionRowProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
}

export interface VisibilityToggleProps {
  label: string;
  subtitle: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}
