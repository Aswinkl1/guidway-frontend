export const Role = {
  ADMIN: "ADMIN",
  MENTOR: "MENTOR",
  MENTEE: "MENTEE",
} as const;

export type Role = (typeof Role)[keyof typeof Role];
