// achievement.schema.ts
import { z } from "zod";

export const AchievementType = {
  AWARD: "AWARD",
  CERTIFICATE: "CERTIFICATE",
  PUBLICATION: "PUBLICATION",
  PROJECT: "PROJECT",
  HONOR: "HONOR",
  OTHER: "OTHER",
} as const;

export type AchievementType =
  (typeof AchievementType)[keyof typeof AchievementType];

export const CreateAchievementSchema = z.object({
  title: z.string().trim().min(1, "Title is required").nullable(),
  type: z.enum(AchievementType),
  year: z
    .number("Year is required")

    .min(1900, "Year must be 1900 or later")
    .max(
      new Date().getFullYear(),
      `Year cannot exceed ${new Date().getFullYear()}`,
    )
    .nullable(),
});

export type AchievementFormData = z.infer<typeof CreateAchievementSchema>;
