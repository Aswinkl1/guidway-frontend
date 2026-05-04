export const EMPLOYMENT_TYPES = [
  { value: "FULL_TIME" as const, label: "Full-time" },
  { value: "PART_TIME" as const, label: "Part-time" },
  { value: "CONTRACT" as const, label: "Contract" },
  { value: "INTERNSHIP" as const, label: "Internship" },
  { value: "FREELANCE" as const, label: "Freelance" },
  { value: "SELF_EMPLOYED" as const, label: "Self-employed" },
  { value: "VOLUNTEER" as const, label: "Volunteer" },
] as const;

export type EmploymentTypeValue = (typeof EMPLOYMENT_TYPES)[number]["value"];
