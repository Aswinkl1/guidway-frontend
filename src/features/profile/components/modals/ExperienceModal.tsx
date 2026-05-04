import { useState } from "react";
import { Briefcase } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  MonthYearPicker,
  CurrentToggle,
  ModalHeader,
  ModalFooter,
} from "@/components/shared";
import type {
  ExperienceFormData,
  ExperienceErrors,
} from "@/features/profile/types/profile.types";
import { EMPLOYMENT_TYPES } from "@/features/profile/constants/profile.constants";
import { createPortal } from "react-dom";

const EXPERIENCE_DEFAULTS: ExperienceFormData = {
  role: "",
  company: "",
  employmentType: "",
  startMonth: "",
  startYear: "",
  endMonth: "",
  endYear: "",
  isCurrent: false,
  description: "",
};

function validateExperience(data: ExperienceFormData): ExperienceErrors {
  const e: ExperienceErrors = {};
  if (!data.role.trim()) e.role = "Role is required";
  if (!data.company.trim()) e.company = "Company is required";
  if (!data.employmentType) e.employmentType = "Employment type is required";
  if (data.startMonth === "") e.startMonth = "Start month is required";
  if (data.startYear === "") e.startYear = "Start year is required";
  if (!data.isCurrent) {
    if (data.endMonth === "") e.endMonth = "End month is required";
    if (data.endYear === "") e.endYear = "End year is required";
    if (
      data.startYear !== "" &&
      data.endYear !== "" &&
      data.startMonth !== "" &&
      data.endMonth !== ""
    ) {
      const start = data.startYear * 12 + (data.startMonth as number);
      const end = (data.endYear as number) * 12 + (data.endMonth as number);
      if (end < start) e.endDate = "End date must be after start date";
    }
  }
  return e;
}

interface ExperienceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ExperienceFormData) => Promise<void> | void;
  initialData?: Partial<ExperienceFormData>;
}

export const ExperienceModal: React.FC<ExperienceModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const [form, setForm] = useState<ExperienceFormData>({
    ...EXPERIENCE_DEFAULTS,
    ...initialData,
  });
  const [errors, setErrors] = useState<ExperienceErrors>({});
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof ExperienceFormData>(
    key: K,
    value: ExperienceFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSave = async () => {
    const errs = validateExperience(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setForm({ ...EXPERIENCE_DEFAULTS, ...initialData });
    setErrors({});
    onClose();
  };
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return createPortal(
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-2xl w-full rounded-2xl p-6 gap-0">
        <ModalHeader
          icon={<Briefcase size={18} />}
          title={initialData ? "Edit Experience" : "Add Experience"}
          subtitle="Tell mentees about your professional background"
        />

        <Separator className="my-4" />

        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
          <FormField label="Job Title" required error={errors.role}>
            <Input
              placeholder="e.g. Senior Software Engineer"
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              className="h-9 text-sm border-slate-200"
            />
          </FormField>

          <FormField label="Company" required error={errors.company}>
            <Input
              placeholder="e.g. Google"
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
              className="h-9 text-sm border-slate-200"
            />
          </FormField>

          <FormField
            label="Employment Type"
            required
            error={errors.employmentType}
          >
            <Select
              value={form.employmentType}
              onValueChange={(v) =>
                set("employmentType", v as ExperienceFormData["employmentType"])
              }
            >
              <SelectTrigger className="h-9 text-sm border-slate-200">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {EMPLOYMENT_TYPES.map(({ value, label }) => (
                  <SelectItem key={value} value={value} className="text-sm">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Start Date"
            required
            error={errors.startMonth || errors.startYear}
          >
            <MonthYearPicker
              monthValue={form.startMonth}
              yearValue={form.startYear}
              onMonthChange={(v) => set("startMonth", v)}
              onYearChange={(v) => set("startYear", v)}
            />
          </FormField>

          <CurrentToggle
            checked={form.isCurrent}
            onChange={(v) => {
              set("isCurrent", v);
              if (v) {
                set("endMonth", "");
                set("endYear", "");
              }
            }}
          />

          {!form.isCurrent && (
            <FormField
              label="End Date"
              required
              error={errors.endMonth || errors.endYear || errors.endDate}
            >
              <MonthYearPicker
                monthValue={form.endMonth}
                yearValue={form.endYear}
                onMonthChange={(v) => set("endMonth", v)}
                onYearChange={(v) => set("endYear", v)}
              />
            </FormField>
          )}

          <FormField label="Description" error={errors.description}>
            <Textarea
              placeholder="Describe your role, key achievements, technologies used…"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              className="text-sm border-slate-200 resize-none"
            />
          </FormField>
        </div>

        <Separator className="my-4" />
        <ModalFooter
          onClose={handleClose}
          onSave={handleSave}
          isSaving={saving}
        />
      </DialogContent>
    </Dialog>,
    modalRoot,
  );
};
