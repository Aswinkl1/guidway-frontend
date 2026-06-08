// TimeRangeModal.tsx
import { createPortal } from "react-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FormField, ModalHeader, ModalFooter } from "@/components/shared";
import z from "zod";
import { useAddAvailability } from "../hooks/useAddAvailability";

export const TimeRangeSchema = z
  .object({
    startTime: z.number(),
    endTime: z.number(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export type TimeRangeFormData = z.infer<typeof TimeRangeSchema>;
interface TimeRangeModalProps {
  open: boolean;
  onClose: () => void;
  /** Called with { startTime, endTime } in "HH:MM" (24-hr) format. */
  onSave: (data: TimeRangeFormData) => Promise<void> | void;
  initialData?: Partial<TimeRangeFormData>;
  /** Optional label shown in the modal subtitle */
  label?: string;
  dayOfWeek: string;
}

const TIME_SLOTS: { value: number; label: string }[] = Array.from(
  { length: 48 },
  (_, i) => {
    const totalMinutes = i * 30;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    // Format the label for 12-hour clock (e.g., "1:30 PM")
    const period = h < 12 ? "AM" : "PM";
    const displayH = h % 12 === 0 ? 12 : h % 12;
    const label = `${displayH}:${String(m).padStart(2, "0")} ${period}`;

    return { value: totalMinutes, label };
  },
);

const DEFAULTS: TimeRangeFormData = {
  startTime: 0,
  endTime: 30,
};

const toDisplayLabel = (value: number) => {
  return TIME_SLOTS.find((s) => s.value === value)?.label ?? value;
};

export const TimeRangeModal = ({
  open,
  onClose,
  onSave,
  initialData,
  label,
  dayOfWeek,
}: TimeRangeModalProps) => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TimeRangeFormData>({
    resolver: zodResolver(TimeRangeSchema),
    defaultValues: { ...DEFAULTS, ...initialData },
  });

  const startTime = watch("startTime");
  const endTime = watch("endTime");

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleClose = () => {
    reset({ ...DEFAULTS, ...initialData });
    onClose();
  };
  const { mutateAsync } = useAddAvailability();
  const submitHandler = async (data: TimeRangeFormData) => {
    console.log("data", data);
    await mutateAsync({ ...data, dayOfWeek: String(dayOfWeek).toUpperCase() });
    handleClose();
  };

  const durationLabel = (() => {
    const diff = endTime - startTime;
    if (diff <= 0) return null;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    if (h === 0) return `${m}m`;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
  })();

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  // ── Render ─────────────────────────────────────────────────────────────────

  return createPortal(
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-sm w-full rounded-2xl p-6 gap-0">
        {/* Header */}
        <ModalHeader
          icon={<Clock size={18} />}
          title="Set Time Range"
          subtitle={
            label
              ? `Choose a time window for "${label}"`
              : "Choose a start and end time"
          }
        />

        <Separator className="my-4" />

        {/* ── Body ── */}
        <div className="flex flex-col gap-5">
          {/* Time pickers row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Start Time */}
            <FormField
              label="Start Time"
              required
              error={errors.startTime?.message}
            >
              <Controller
                control={control}
                name="startTime"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9 text-sm border-slate-200">
                      <Clock
                        size={13}
                        className="text-slate-400 shrink-0 mr-1"
                      />
                      <SelectValue placeholder="From" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {TIME_SLOTS.map(({ value, label }) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="text-sm"
                        >
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            {/* End Time */}
            <FormField
              label="End Time"
              required
              error={errors.endTime?.message}
            >
              <Controller
                control={control}
                name="endTime"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9 text-sm border-slate-200">
                      <Clock
                        size={13}
                        className="text-slate-400 shrink-0 mr-1"
                      />
                      <SelectValue placeholder="To" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {TIME_SLOTS.map(({ value, label }) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="text-sm"
                        >
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>

          {/* Duration summary pill */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                Duration
              </span>
              <span className="text-sm font-semibold text-slate-700">
                {durationLabel ?? (
                  <span className="text-red-400 font-normal text-xs">
                    End must be after start
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="font-medium text-slate-700">
                {toDisplayLabel(startTime)}
              </span>
              <span className="text-slate-300">→</span>
              <span className="font-medium text-slate-700">
                {toDisplayLabel(endTime)}
              </span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Footer */}
        <ModalFooter
          onClose={handleClose}
          onSave={handleSubmit(submitHandler)}
          isSaving={isSubmitting}
          saveLabel="Save Time Range"
        />
      </DialogContent>
    </Dialog>,
    modalRoot,
  );
};
