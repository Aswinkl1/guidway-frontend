import { z } from "zod";

export const MentorSkillSchema = z.object({
  skillId: z.uuid("Please select a valid skill"),
  yearsExperience: z.number().min(0).optional(),
});

export const SkillsFormSchema = z.object({
  skills: z.array(MentorSkillSchema).min(1, "Please select at least one skill"),
});

export type SkillEntry = z.infer<typeof MentorSkillSchema>;
export type SkillsFormData = z.infer<typeof SkillsFormSchema>;

export interface SkillOption {
  id: string;
  name: string;
  category?: string;
}

export interface SkillModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: SkillEntry[]) => Promise<void> | void;
  initialData?: SkillEntry[];
}
