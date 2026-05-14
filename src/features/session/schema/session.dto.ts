import z from "zod";

export const CreateSessionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Max 100 characters"),
  duration: z
    .number("Duration is required")
    .int("Duration must be a whole number")
    .positive("Duration must be a positive number"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Max 1000 characters"),
  isActive: z.boolean(),
  price: z.number("Price is required").min(0, "Price must be 0 or more"),
});

export type CreateSessionDTO = z.infer<typeof CreateSessionSchema>;
