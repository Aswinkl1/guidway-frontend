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
import {
  EMPLOYMENT_TYPE_VALUES,
  EMPLOYMENT_TYPES,
} from "@/features/profile/constants/profile.constants";
import { createPortal } from "react-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateExperienceSchema,
  type ExperienceFormData,
} from "../../schemas/experience.schema";

const currentYear = new Date().getFullYear();

const EXPERIENCE_DEFAULTS: ExperienceFormData = {
  role: "",
  company: "",
  employmentType: EMPLOYMENT_TYPE_VALUES[0],
  startMonth: new Date().getMonth() + 1,
  startYear: currentYear,
  endMonth: undefined,
  endYear: undefined,
  isCurrent: false,
  description: undefined,
};

interface ExperienceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ExperienceFormData) => Promise<void> | void;
  initialData?: Partial<ExperienceFormData>;
}

export const ExperienceModal = ({
  open,
  onClose,
  onSave,
  initialData,
}: ExperienceModalProps) => {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(CreateExperienceSchema),
    defaultValues: { ...EXPERIENCE_DEFAULTS, ...initialData },
  });

  const isCurrent = watch("isCurrent");

  const submitHandler = async (data: ExperienceFormData) => {
    console.log(data);
    await onSave(data);
    onClose();
    reset();
  };

  const handleClose = () => {
    reset({ ...EXPERIENCE_DEFAULTS, ...initialData });
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
          <FormField label="Job Title" required error={errors.role?.message}>
            <Input
              placeholder="e.g. Senior Software Engineer"
              {...register("role", { required: "Role is required" })}
              className="h-9 text-sm border-slate-200"
            />
          </FormField>

          <FormField label="Company" required error={errors.company?.message}>
            <Input
              placeholder="e.g. Google"
              {...register("company", { required: "Company is required" })}
              className="h-9 text-sm border-slate-200"
            />
          </FormField>

          <FormField
            label="Employment Type"
            required
            error={errors.employmentType?.message}
          >
            <Controller
              control={control}
              name="employmentType"
              rules={{ required: "Employment type is required" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
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
              )}
            />
          </FormField>

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

          <FormField label="Description" error={errors.description?.message}>
            <Textarea
              placeholder="Describe your role, key achievements, technologies used…"
              {...register("description")}
              rows={4}
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
