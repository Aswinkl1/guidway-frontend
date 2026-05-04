import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  MonthYearPicker,
  CurrentToggle,
  ModalHeader,
  ModalFooter,
} from "@/components/shared";
import type {
  EducationFormData,
  EducationErrors,
} from "@/features/profile/types/profile.types";
import { Separator } from "@/components/ui/separator";
import { createPortal } from "react-dom";

const EDUCATION_DEFAULTS: EducationFormData = {
  institution: "",
  degree: "",
  fieldOfStudy: "",
  startMonth: "",
  startYear: "",
  endMonth: "",
  endYear: "",
  isCurrent: false,
  grade: "",
  description: "",
};

function validateEducation(data: EducationFormData): EducationErrors {
  const e: EducationErrors = {};
  if (!data.institution.trim()) e.institution = "Institution is required";
  if (!data.degree.trim()) e.degree = "Degree is required";
  if (!data.fieldOfStudy.trim()) e.fieldOfStudy = "Field of study is required";
  if (data.startMonth === "") e.startMonth = "Start month is required";
  if (data.startYear === "") e.startYear = "Start year is required";
  if (!data.isCurrent) {
    if (data.endMonth === "") e.endMonth = "End month is required";
    if (data.endYear === "") e.endYear = "End year is required";
  }
  return e;
}

interface EducationModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: EducationFormData) => Promise<void> | void;
  initialData?: Partial<EducationFormData>;
}

export const EducationModal: React.FC<EducationModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const [form, setForm] = useState<EducationFormData>({
    ...EDUCATION_DEFAULTS,
    ...initialData,
  });
  const [errors, setErrors] = useState<EducationErrors>({});
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof EducationFormData>(
    key: K,
    value: EducationFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSave = async () => {
    const errs = validateEducation(form);
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
    setForm({ ...EDUCATION_DEFAULTS, ...initialData });
    setErrors({});
    onClose();
  };

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;
  return createPortal(
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-lg w-full rounded-2xl p-6 gap-0">
        <ModalHeader
          icon={<GraduationCap size={18} />}
          title={initialData ? "Edit Education" : "Add Education"}
          subtitle="Share your academic qualifications with mentees"
        />

        <Separator className="my-4" />

        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
          <FormField label="Institution" required error={errors.institution}>
            <Input
              placeholder="e.g. Stanford University"
              value={form.institution}
              onChange={(e) => set("institution", e.target.value)}
              className="h-9 text-sm border-slate-200"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Degree" required error={errors.degree}>
              <Input
                placeholder="e.g. B.Sc."
                value={form.degree}
                onChange={(e) => set("degree", e.target.value)}
                className="h-9 text-sm border-slate-200"
              />
            </FormField>
            <FormField
              label="Field of Study"
              required
              error={errors.fieldOfStudy}
            >
              <Input
                placeholder="e.g. Computer Science"
                value={form.fieldOfStudy}
                onChange={(e) => set("fieldOfStudy", e.target.value)}
                className="h-9 text-sm border-slate-200"
              />
            </FormField>
          </div>

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
            label="I am currently studying here"
          />

          {!form.isCurrent && (
            <FormField
              label="End Date"
              required
              error={errors.endMonth || errors.endYear}
            >
              <MonthYearPicker
                monthValue={form.endMonth}
                yearValue={form.endYear}
                onMonthChange={(v) => set("endMonth", v)}
                onYearChange={(v) => set("endYear", v)}
              />
            </FormField>
          )}

          <FormField label="Grade / GPA" error={errors.grade}>
            <Input
              placeholder="e.g. 4.0 GPA or First Class Honours"
              value={form.grade}
              onChange={(e) => set("grade", e.target.value)}
              className="h-9 text-sm border-slate-200"
            />
          </FormField>

          <FormField label="Description" error={errors.description}>
            <Textarea
              placeholder="Relevant coursework, thesis, activities…"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
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
