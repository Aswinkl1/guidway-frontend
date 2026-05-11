// schemas/edit-profile.schema.ts
import { z } from "zod";

// ─── Overview ─────────────────────────────────────────────────────────────────

export const UpdateMentorOverviewSchema = z.object({
  shortBio: z.string().trim().optional(),
  headline: z.string().trim().optional(),
  domainId: z.uuid({ message: "Please select a domain" }),
});

export type UpdateMentorOverviewDTO = z.infer<
  typeof UpdateMentorOverviewSchema
>;

// ─── Social Links ─────────────────────────────────────────────────────────────

export const CreateSocialLinkSchema = z.object({
  links: z
    .array(z.url({ message: "Must be a valid URL" }))
    .min(1, { message: "At least one link is required" })
    .max(5, { message: "Maximum 5 links allowed" }),
});

export type CreateSocialLinkDTO = z.infer<typeof CreateSocialLinkSchema>;

// ─── User Profile ─────────────────────────────────────────────────────────────

export const EditUserProfileSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  phoneNumber: z.string().trim().optional(),
  timezone: z.string().min(1, { message: "Timezone is required" }),
});

export type EditProfileDTO = z.infer<typeof EditUserProfileSchema>;

// ─── Combined form (single useForm instance) ─────────────────────────────────

export const EditProfileFormSchema = z.object({
  // EditUserProfileSchema fields
  name: z.string().trim().min(1, { message: "Name is required" }),
  phoneNumber: z.string().trim().optional(),
  timezone: z.string().min(1, { message: "Timezone is required" }),

  // UpdateMentorOverviewSchema fields
  shortBio: z.string().trim().optional(),
  headline: z.string().trim().optional(),
  domainId: z.uuid({ message: "Please select a domain" }),

  links: z
    .array(z.object({ value: z.url({ message: "Must be a valid URL" }) }))
    .max(5, { message: "Maximum 5 links allowed" })
    .default([]),
  // links: z
  //   .array(z.url({ message: "Must be a valid URL" }))
  //   .min(1, { message: "At least one link is required" })
  //   .max(5, { message: "Maximum 5 links allowed" }),
  // Profile picture (File object — validated client-side only)
  avatarFile: z.instanceof(File).optional(),
});

export type EditProfileFormData = z.infer<typeof EditProfileFormSchema>;
