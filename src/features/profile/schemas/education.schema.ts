// schemas/education.schema.ts
import { z } from "zod";

const currentYear = new Date().getFullYear();

export const CreateEducationSchema = z
  .object({
    institution: z
      .string()
      .trim()
      .min(2, "Institution must be at least 2 characters")
      .max(100, "Institution name is too long"),

    degree: z
      .string()
      .trim()
      .min(2, "Degree must be at least 2 characters")
      .max(100, "Degree is too long"),

    fieldOfStudy: z
      .string()
      .trim()
      .min(2, "Field of study must be at least 2 characters")
      .max(100, "Field of study is too long"),

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

    grade: z.string().trim().max(50, "Grade is too long").nullable().optional(),

    description: z
      .string()
      .trim()
      .max(1000, "Description cannot exceed 1000 characters")
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.isCurrent) {
        return data.endMonth != null && data.endYear != null;
      }
      return true;
    },
    {
      message: "End date is required if not currently studying",
      path: ["endMonth"],
    },
  )
  .refine(
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

export type EducationFormData = z.infer<typeof CreateEducationSchema>;
export const EditEducationSchema = CreateEducationSchema.extend({
  id: z.uuid(),
});

export type EditEducationType = z.infer<typeof EditEducationSchema>;

export const DeleteEducationSchema = EditEducationSchema.required({ id: true });

export type DeleteEducationType = z.infer<typeof DeleteEducationSchema>;
