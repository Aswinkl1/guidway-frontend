import z from "zod";

export const CreateSessionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Max 100 characters"),
  duration: z
    .number("Duration is required")
    .int("Duration must be a whole number")
    .positive("Duration must be a positive number"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(1000, "Max 1000 characters"),
  isActive: z.boolean(),
  price: z.number("Price is required").min(0, "Price must be 0 or more"),
});

export type CreateSessionDTO = z.infer<typeof CreateSessionSchema>;
export const editSessionSchema = CreateSessionSchema.partial().extend({
  id: z.uuid(),
});

export const DeleteSessionSchema = z.object({
  id: z.uuid(),
  mentorId: z.uuid().optional(),
});

export type editSessionDTO = z.infer<typeof editSessionSchema>;
export type DeleteSessionDTO = z.infer<typeof DeleteSessionSchema>;
