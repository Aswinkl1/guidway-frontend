// schemas/experience.schema.ts
import { z } from "zod";
import { EmploymentTypeEnum } from "../constants/profile.constants";

const currentYear = new Date().getFullYear();

const BaseExperienceSchema = z.object({
  role: z
    .string()
    .trim()
    .min(2, "Role must be at least 2 characters")
    .max(100, "Role is too long"),

  company: z
    .string()
    .trim()
    .min(2, "Company must be at least 2 characters")
    .max(100, "Company name is too long"),

  employmentType: EmploymentTypeEnum,

  startMonth: z
    .number()
    .int()
    .min(1, "Month must be between 1 and 12")
    .max(12, "Month must be between 1 and 12"),

  startYear: z
    .number()
    .int()
    .min(1950, "Year must be 1950 or later")
    .max(currentYear, "Start year cannot be in the future"),

  endMonth: z.number().int().min(1).max(12).nullable().optional(),

  endYear: z
    .number()
    .int()
    .min(1950)
    .max(currentYear + 5)
    .nullable()
    .optional(),

  isCurrent: z.boolean(),

  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters")
    .nullable()
    .optional(),
});

export const CreateExperienceSchema = BaseExperienceSchema.refine(
  (data) => {
    if (!data.isCurrent) {
      return data.endMonth != null && data.endYear != null;
    }
    return true;
  },
  {
    message: "End date is required if not current",
    path: ["endMonth"],
  },
).refine(
  (data) => {
    if (!data.isCurrent && data.endMonth && data.endYear) {
      const start = data.startYear * 12 + data.startMonth;
      const end = data.endYear * 12 + data.endMonth;

      return end >= start;
    }

    return true;
  },
  {
    message: "End date must be after start date",
    path: ["endYear"],
  },
);

export type ExperienceFormData = z.infer<typeof CreateExperienceSchema>;

export const EditExperienceSchema = BaseExperienceSchema.extend({
  id: z.uuid(),
});

export type EditExperienceType = z.infer<typeof EditExperienceSchema>;

// export const DeleteExperienceSchema = EditExperienceSchema.pick({
//   id: true,
// });

// export type DeleteExperienceType = z.infer<typeof DeleteExperienceSchema>;
