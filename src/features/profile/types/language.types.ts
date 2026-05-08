import { z } from "zod";

export const ProficiencyLevelSchema = z.enum([
  "NATIVE",
  "FLUENT",
  "CONVERSATIONAL",
  "BASIC",
]);

export const MentorLanguageSchema = z.object({
  languageId: z.uuid("Please select a valid language"),
  proficiency: ProficiencyLevelSchema,
});

export const LanguagesFormSchema = z.object({
  languages: z
    .array(MentorLanguageSchema)
    .min(1, "Please select at least one language"),
});

export type LanguageEntry = z.infer<typeof MentorLanguageSchema>;

export type LanguagesFormData = z.infer<typeof LanguagesFormSchema>;

export interface LanguageOption {
  id: string;
  name: string;
  code: string;
}

export interface LanguageModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: LanguageEntry[]) => Promise<void> | void;
  initialData?: LanguageEntry[];
}
