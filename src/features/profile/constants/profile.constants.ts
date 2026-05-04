import z from "zod";

export const EMPLOYMENT_TYPE_VALUES = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "FREELANCE",
  "SELF_EMPLOYED",
  "VOLUNTEER",
] as const;

export const EmploymentTypeEnum = z.enum(EMPLOYMENT_TYPE_VALUES);

export type EmploymentTypeValue = (typeof EMPLOYMENT_TYPE_VALUES)[number];

export const EMPLOYMENT_TYPES = EMPLOYMENT_TYPE_VALUES.map((value) => ({
  value,
  label: value.replace("_", " "),
}));
