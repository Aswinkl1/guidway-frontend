// EducationModal.tsx
import { GraduationCap } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  MonthYearPicker,
  CurrentToggle,
  ModalHeader,
  ModalFooter,
} from "@/components/shared";
import { createPortal } from "react-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateEducationSchema,
  type EducationFormData,
} from "../../schemas/education.schema";

const currentYear = new Date().getFullYear();

const EDUCATION_DEFAULTS: EducationFormData = {
  institution: "",
  degree: "",
  fieldOfStudy: "",
  startMonth: new Date().getMonth() + 1,
  startYear: currentYear,
  endMonth: undefined,
  endYear: undefined,
  isCurrent: false,
  grade: undefined,
  description: undefined,
};

interface EducationModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: EducationFormData) => Promise<void> | void;
  initialData?: Partial<EducationFormData>;
}

export const EducationModal = ({
  open,
  onClose,
  onSave,
  initialData,
}: EducationModalProps) => {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EducationFormData>({
    resolver: zodResolver(CreateEducationSchema),
    defaultValues: { ...EDUCATION_DEFAULTS, ...initialData },
  });

  const isCurrent = watch("isCurrent");

  const submitHandler = async (data: EducationFormData) => {
    await onSave(data);
    onClose();
    reset();
  };

  const handleClose = () => {
    reset({ ...EDUCATION_DEFAULTS, ...initialData });
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
          <FormField
            label="Institution"
            required
            error={errors.institution?.message}
          >
            <Input
              placeholder="e.g. Stanford University"
              {...register("institution")}
              className="h-9 text-sm border-slate-200"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Degree" required error={errors.degree?.message}>
              <Input
                placeholder="e.g. B.Sc."
                {...register("degree")}
                className="h-9 text-sm border-slate-200"
              />
            </FormField>

            <FormField
              label="Field of Study"
              required
              error={errors.fieldOfStudy?.message}
            >
              <Input
                placeholder="e.g. Computer Science"
                {...register("fieldOfStudy")}
                className="h-9 text-sm border-slate-200"
              />
            </FormField>
          </div>

          <FormField
            label="Start Date"
            required
            error={errors.startMonth?.message || errors.startYear?.message}
          >
            <Controller
              control={control}
              name="startMonth"
              render={({ field }) => (
                <MonthYearPicker
                  monthValue={field.value}
                  yearValue={watch("startYear")}
                  onMonthChange={field.onChange}
                  onYearChange={(v) => setValue("startYear", Number(v))}
                />
              )}
            />
          </FormField>

          <Controller
            control={control}
            name="isCurrent"
            render={({ field }) => (
              <CurrentToggle
                checked={field.value}
                onChange={(v) => {
                  field.onChange(v);
                  if (v) {
                    setValue("endMonth", null);
                    setValue("endYear", null);
                  }
                }}
                label="I am currently studying here"
              />
            )}
          />

          {!isCurrent && (
            <FormField
              label="End Date"
              required
              error={errors.endMonth?.message || errors.endYear?.message}
            >
              <Controller
                control={control}
                name="endMonth"
                render={({ field }) => (
                  <MonthYearPicker
                    monthValue={field.value ?? ""}
                    yearValue={watch("endYear") ?? ""}
                    onMonthChange={field.onChange}
                    onYearChange={(v) => setValue("endYear", Number(v))}
                  />
                )}
              />
            </FormField>
          )}

          <FormField label="Grade / GPA" error={errors.grade?.message}>
            <Input
              placeholder="e.g. 4.0 GPA or First Class Honours"
              {...register("grade")}
              className="h-9 text-sm border-slate-200"
            />
          </FormField>

          <FormField label="Description" error={errors.description?.message}>
            <Textarea
              placeholder="Relevant coursework, thesis, activities…"
              {...register("description")}
              rows={3}
              className="text-sm border-slate-200 resize-none"
            />
          </FormField>
        </div>

        <Separator className="my-4" />
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
