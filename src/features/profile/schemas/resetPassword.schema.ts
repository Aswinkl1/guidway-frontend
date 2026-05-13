import z from "zod";

const passwordField = z
  .string("Password is required.")
  .trim()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Must contain at least one lowercase letter.")
  .regex(/[0-9]/, "Must contain at least one number.");

export const ChangePasswordFormSchema = z
  .object({
    oldPassword: passwordField,
    newPassword: passwordField,
    confirmPassword: z.string("Please confirm your new password."),
  })
  .refine((d) => d.oldPassword !== d.newPassword, {
    message: "New password must be different from the old password.",
    path: ["newPassword"],
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof ChangePasswordFormSchema>;
