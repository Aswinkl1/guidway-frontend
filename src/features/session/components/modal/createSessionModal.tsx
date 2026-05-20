// CreateSessionModal.tsx
import { createPortal } from "react-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CalendarPlus, Clock, DollarSign, ToggleLeft } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { FormField, ModalHeader, ModalFooter } from "@/components/shared";
import {
  type CreateSessionDTO,
  CreateSessionSchema,
} from "../../schema/session.dto";
import { CharCount } from "@/components/shared/CharCount";
import { DurationPill } from "../DurationPill";
import { handleServerErrors } from "@/helpers/formErrorHelper";

/** Common durations shown as quick-select pills */
const DURATION_PRESETS = [15, 30, 45, 60, 90, 120] as const;

const MAX_DESCRIPTION = 1000;
const MAX_NAME = 100;

const DEFAULTS: CreateSessionDTO = {
  name: "",
  duration: 30,
  description: "",
  isActive: true,
  price: 0,
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface CreateSessionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateSessionDTO) => Promise<void> | void;
  initialData?: Partial<CreateSessionDTO>;
}

export const CreateSessionModal: React.FC<CreateSessionModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateSessionDTO>({
    resolver: zodResolver(CreateSessionSchema),
    defaultValues: { ...DEFAULTS, ...initialData },
  });
  console.log("outsie inti", initialData);
  const nameValue = watch("name") ?? "";
  const descriptionValue = watch("description") ?? "";
  const durationValue = watch("duration");
  const isActiveValue = watch("isActive");

  // ── Handlers ──────────────────────────────────────────────────────────────

  const submitHandler = async (data: CreateSessionDTO) => {
    try {
      await onSave(data);
      console.log("on save intital", initialData);
      reset({ ...DEFAULTS, ...data });
      // handleClose();
      onClose();
    } catch (error) {
      handleServerErrors(error, setError, data);
    }
  };

  const handleClose = () => {
    reset({ ...DEFAULTS, ...initialData });
    onClose();
  };

  // ── Portal guard ──────────────────────────────────────────────────────────

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  // ── Render ────────────────────────────────────────────────────────────────

  return createPortal(
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-lg w-full rounded-2xl p-6 gap-0">
        {/* Header */}
        <ModalHeader
          icon={<CalendarPlus size={18} />}
          title={initialData ? "Edit Session Type" : "Add Session Type"}
          subtitle="Define what you offer and how mentees can book you"
        />

        <Separator className="my-4" />

        {/* Body */}
        <div className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto pr-1">
          {/* Name */}
          <FormField label="Session Name" required error={errors.name?.message}>
            <Input
              placeholder="e.g. Mock Interview, Career Strategy"
              {...register("name")}
              className="h-9 text-sm border-slate-200"
            />
            <CharCount current={nameValue.length} max={MAX_NAME} />
          </FormField>

          {/* Duration */}
          <FormField label="Duration" required error={errors.duration?.message}>
            {/* Quick presets */}
            <div className="flex flex-wrap gap-2 mb-2">
              {DURATION_PRESETS.map((preset) => (
                <DurationPill
                  key={preset}
                  value={preset}
                  selected={durationValue === preset}
                  onSelect={(v) =>
                    setValue("duration", v, { shouldValidate: true })
                  }
                />
              ))}
            </div>

            {/* Custom value input */}
            <div className="relative">
              <Clock
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <Input
                type="number"
                min={1}
                placeholder="Custom (minutes)"
                {...register("duration", { valueAsNumber: true })}
                className="h-9 pl-8 text-sm border-slate-200"
              />
            </div>
          </FormField>

          {/* Price */}
          <FormField label="Price (USD)" required error={errors.price?.message}>
            <div className="relative">
              <DollarSign
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <Input
                type="number"
                min={0}
                step={0.01}
                placeholder="0.00"
                {...register("price", { valueAsNumber: true })}
                className="h-9 pl-8 text-sm border-slate-200"
              />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Set to 0 for a free session
            </p>
          </FormField>

          {/* Description */}
          <FormField
            label="Description"
            required
            error={errors.description?.message}
          >
            <Textarea
              placeholder="Describe what mentees can expect from this session…"
              {...register("description")}
              rows={4}
              className="text-sm border-slate-200 resize-none"
            />
            <CharCount
              current={descriptionValue.length}
              max={MAX_DESCRIPTION}
            />
          </FormField>

          {/* isActive toggle */}
          <div
            className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
              isActiveValue
                ? "border-emerald-200 bg-emerald-50"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <ToggleLeft
                size={15}
                className={
                  isActiveValue ? "text-emerald-600" : "text-slate-400"
                }
              />
              <div>
                <Label
                  className={`text-sm font-medium ${isActiveValue ? "text-emerald-800" : "text-slate-600"}`}
                >
                  {isActiveValue ? "Active" : "Inactive"}
                </Label>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isActiveValue
                    ? "Mentees can discover and book this session"
                    : "Session is hidden and cannot be booked"}
                </p>
              </div>
            </div>
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-emerald-500"
                />
              )}
            />
          </div>
        </div>

        <Separator className="my-4" />

        {/* Footer */}
        <ModalFooter
          onClose={handleClose}
          onSave={handleSubmit(submitHandler)}
          isSaving={isSubmitting}
          saveLabel={initialData ? "Save Changes" : "Create Session"}
        />
      </DialogContent>
    </Dialog>,
    modalRoot,
  );
};
