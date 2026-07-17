// AddReviewModal.tsx
import { useState } from "react";
import { MessageSquareText, Star } from "lucide-react";
import { createPortal } from "react-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { FormField, ModalHeader, ModalFooter } from "@/components/shared";

// review.schema.ts
import { z } from "zod";

export const CreateReviewSchema = z.object({
  rating: z.number().int().min(1, "Please select a star rating").max(5),
  comment: z
    .string()
    .trim()
    .min(10, "Review must be at least 10 characters")
    .max(1000, "Review must be under 1000 characters"),
});

export type ReviewFormData = z.infer<typeof CreateReviewSchema>;
// ─── Constants ────────────────────────────────────────────────────────────────

const STAR_VALUES = [1, 2, 3, 4, 5] as const;

// ─── Defaults ────────────────────────────────────────────────────────────────

const REVIEW_DEFAULTS: ReviewFormData = {
  rating: 0 as unknown as ReviewFormData["rating"],
  comment: "",
};

// ─── Star Rating sub-component ──────────────────────────────────────────────

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
}

/**
 * Renders 5 selectable stars. Clicking a star sets the rating to that value;
 * clicking the currently-selected star again clears the rating back to 0.
 * A transient hover state previews the rating without committing it.
 */
const StarRatingInput = ({ value, onChange }: StarRatingInputProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const displayValue = hovered ?? value;

  return (
    <div
      className="flex items-center gap-1"
      onMouseLeave={() => setHovered(null)}
    >
      {STAR_VALUES.map((star) => {
        const filled = star <= displayValue;

        return (
          <button
            key={star}
            type="button"
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            aria-pressed={star === value}
            onMouseEnter={() => setHovered(star)}
            onClick={() => onChange(star === value ? 0 : star)}
            className="p-0.5 rounded-md transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <Star
              size={26}
              className={cn(
                "transition-colors",
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-slate-300",
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

// ─── Props ───────────────────────────────────────────────────────────────────

interface AddReviewModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ReviewFormData) => Promise<void> | void;
  initialData?: Partial<ReviewFormData>;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const AddReviewModal = ({
  open,
  onClose,
  onSave,
  initialData,
}: AddReviewModalProps) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(CreateReviewSchema),
    defaultValues: { ...REVIEW_DEFAULTS, ...initialData },
  });

  // ── Handlers ───────────────────────────────────────────────────────────────

  const submitHandler = async (data: ReviewFormData) => {
    console.log(data);
    // TODO(Asiwn): wire up the actual mutation (e.g. useCreateReviewMutation)
    // and handle success/error toasts here.
    await onSave(data);
    onClose();
    reset();
  };

  const handleClose = () => {
    reset({ ...REVIEW_DEFAULTS, ...initialData });
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
          icon={<MessageSquareText size={18} />}
          title={initialData ? "Edit Review" : "Add Review"}
          subtitle="Share your feedback about the session"
        />

        <Separator className="my-4" />

        {/* Form body */}
        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Rating */}
          <FormField label="Rating" required error={errors.rating?.message}>
            <Controller
              control={control}
              name="rating"
              render={({ field }) => (
                <StarRatingInput
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FormField>

          {/* Comment */}
          <FormField label="Review" required error={errors.comment?.message}>
            <Textarea
              placeholder="Tell us about your experience..."
              rows={5}
              {...register("comment")}
              className="text-sm border-slate-200 resize-none"
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
