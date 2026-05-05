// AchievementModal.tsx
import { Trophy } from "lucide-react";
import { createPortal } from "react-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FormField, ModalHeader, ModalFooter } from "@/components/shared";
import {
  AchievementType,
  CreateAchievementSchema,
  type AchievementFormData,
} from "../../schemas/achievement.schema";

// ─── Constants ────────────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();

/** Maps each enum value to a human-readable label shown in the dropdown. */
const ACHIEVEMENT_TYPE_OPTIONS: { value: AchievementType; label: string }[] = [
  { value: AchievementType.AWARD, label: "Award" },
  { value: AchievementType.CERTIFICATE, label: "Certificate" },
  { value: AchievementType.PUBLICATION, label: "Publication" },
  { value: AchievementType.PROJECT, label: "Project" },
  { value: AchievementType.HONOR, label: "Honor" },
  { value: AchievementType.OTHER, label: "Other" },
];

/**
 * Generates a descending list of years from the current year back to 1900.
 * Reused each render — defined outside component to avoid re-allocation.
 */
const YEAR_OPTIONS: number[] = Array.from(
  { length: CURRENT_YEAR - 1900 + 1 },
  (_, i) => CURRENT_YEAR - i,
);

// ─── Defaults ────────────────────────────────────────────────────────────────

const ACHIEVEMENT_DEFAULTS: AchievementFormData = {
  title: "",
  type: AchievementType.AWARD,
  year: CURRENT_YEAR,
};

// ─── Props ───────────────────────────────────────────────────────────────────

interface AchievementModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: AchievementFormData) => Promise<void> | void;
  initialData?: Partial<AchievementFormData>;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const AchievementModal = ({
  open,
  onClose,
  onSave,
  initialData,
}: AchievementModalProps) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AchievementFormData>({
    resolver: zodResolver(CreateAchievementSchema),
    defaultValues: { ...ACHIEVEMENT_DEFAULTS, ...initialData },
  });

  // ── Handlers ───────────────────────────────────────────────────────────────

  const submitHandler = async (data: AchievementFormData) => {
    await onSave(data);
    onClose();
    reset();
  };

  const handleClose = () => {
    reset({ ...ACHIEVEMENT_DEFAULTS, ...initialData });
    onClose();
  };

  // ── Portal guard ───────────────────────────────────────────────────────────

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  // ── Render ─────────────────────────────────────────────────────────────────

  return createPortal(
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-lg w-full rounded-2xl p-6 gap-0">
        {/* Header */}
        <ModalHeader
          icon={<Trophy size={18} />}
          title={initialData ? "Edit Achievement" : "Add Achievement"}
          subtitle="Highlight awards, certifications and recognitions"
        />

        <Separator className="my-4" />

        {/* Form body */}
        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Title */}
          <FormField label="Title" required error={errors.title?.message}>
            <Input
              placeholder="e.g. Best Engineering Mentor"
              {...register("title")}
              className="h-9 text-sm border-slate-200"
            />
          </FormField>

          {/* Type */}
          <FormField label="Type" required error={errors.type?.message}>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={(v) => field.onChange(v as AchievementType)}
                >
                  <SelectTrigger className="h-9 text-sm border-slate-200">
                    <SelectValue placeholder="Select achievement type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACHIEVEMENT_TYPE_OPTIONS.map(({ value, label }) => (
                      <SelectItem key={value} value={value} className="text-sm">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          {/* Year */}
          <FormField label="Year" required error={errors.year?.message}>
            <Controller
              control={control}
              name="year"
              render={({ field }) => (
                <Select
                  value={field.value != null ? String(field.value) : ""}
                  onValueChange={(v) => field.onChange(v ? Number(v) : null)}
                >
                  <SelectTrigger className="h-9 text-sm border-slate-200">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent className="max-h-52 overflow-y-auto">
                    {YEAR_OPTIONS.map((y) => (
                      <SelectItem key={y} value={String(y)} className="text-sm">
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        </div>

        <Separator className="my-4" />

        {/* Footer */}
        <ModalFooter
          onClose={handleClose}
          onSave={handleSubmit(submitHandler)}
          isSaving={isSubmitting}
        />
      </DialogContent>
    </Dialog>,
    modalRoot,
  );
};
