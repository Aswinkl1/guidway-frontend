// ChangePasswordModal.tsx
import { useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { KeyRound, Eye, EyeOff } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

import { FormField, ModalHeader, ModalFooter } from "@/components/shared";
import {
  type ChangePasswordFormData,
  ChangePasswordFormSchema,
} from "../../schemas/resetPassword.schema";
import { handleServerErrors } from "@/helpers/formErrorHelper";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  /** Receives only { oldPassword, newPassword } — confirmPassword is stripped. */
  onSave: (data: {
    oldPassword: string;
    newPassword: string;
  }) => Promise<void> | void;
}

const DEFAULTS: ChangePasswordFormData = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

// ─── PasswordInput — Input + show/hide toggle ─────────────────────────────────

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  show: boolean;
  onToggle: () => void;
}

const PasswordInput = ({ show, onToggle, ...props }: PasswordInputProps) => (
  <div className="relative">
    <Input
      {...props}
      type={show ? "text" : "password"}
      className={`h-9 text-sm border-slate-200 pr-10 ${props.className ?? ""}`}
    />
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400
        hover:text-slate-600 transition-colors"
      tabIndex={-1}
      aria-label={show ? "Hide password" : "Show password"}
    >
      {show ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  </div>
);

// ─── Password strength indicator ──────────────────────────────────────────────

const rules = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "One uppercase letter (A–Z)", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One lowercase letter (a–z)", test: (v: string) => /[a-z]/.test(v) },
  { label: "One number (0–9)", test: (v: string) => /[0-9]/.test(v) },
];

const PasswordStrength = ({ value }: { value: string }) => {
  if (!value) return null;
  const passed = rules.filter((r) => r.test(value)).length;
  const colors = [
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-emerald-400",
  ];
  const color = colors[passed - 1] ?? "bg-slate-200";

  return (
    <div className="flex flex-col gap-2 mt-1">
      {/* Bar */}
      <div className="flex gap-1">
        {rules.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < passed ? color : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      {/* Rules checklist */}
      <ul className="flex flex-col gap-0.5">
        {rules.map(({ label, test }) => {
          const ok = test(value);
          return (
            <li
              key={label}
              className={`flex items-center gap-1.5 text-xs ${ok ? "text-emerald-600" : "text-slate-400"}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${ok ? "bg-emerald-500" : "bg-slate-300"}`}
              />
              {label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// ─── Modal ────────────────────────────────────────────────────────────────────

export const ChangePasswordModal = ({
  open,
  onClose,
  onSave,
}: ChangePasswordModalProps) => {
  const [show, setShow] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const toggle = (field: keyof typeof show) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  // ── Form ─────────────────────────────────────────────────────────────────

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordFormSchema),
    defaultValues: DEFAULTS,
  });

  const newPasswordValue = watch("newPassword");

  // ── Handlers ─────────────────────────────────────────────────────────────

  const submitHandler = async (data: ChangePasswordFormData) => {
    try {
      await onSave({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      handleClose();
    } catch (error) {
      console.log(error);

      handleServerErrors(error, setError, data);
    }
  };

  const handleClose = () => {
    reset(DEFAULTS);
    setShow({ old: false, new: false, confirm: false });
    onClose();
  };

  // ── Portal guard ──────────────────────────────────────────────────────────

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  // ── Render ────────────────────────────────────────────────────────────────

  return createPortal(
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md w-full rounded-2xl p-6 gap-0">
        <ModalHeader
          icon={<KeyRound size={18} />}
          title="Change Password"
          subtitle="Choose a strong password you haven't used before"
        />

        <Separator className="my-4" />
        {errors.root?.serverError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zM9 7a1 1 0 012 0v3a1 1 0 11-2 0V7zm1 7a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                clipRule="evenodd"
              />
            </svg>

            <span>{errors.root.serverError.message}</span>
          </div>
        )}
        <div className="flex flex-col gap-4">
          {/* Old password */}
          <FormField
            label="Current Password"
            required
            error={errors.oldPassword?.message}
          >
            <PasswordInput
              {...register("oldPassword")}
              placeholder="Enter your current password"
              show={show.old}
              onToggle={() => toggle("old")}
              autoComplete="current-password"
            />
          </FormField>

          <Separator />

          {/* New password */}
          <FormField
            label="New Password"
            required
            error={errors.newPassword?.message}
          >
            <PasswordInput
              {...register("newPassword")}
              placeholder="Enter a new password"
              show={show.new}
              onToggle={() => toggle("new")}
              autoComplete="new-password"
            />
            <PasswordStrength value={newPasswordValue} />
          </FormField>

          {/* Confirm new password */}
          <FormField
            label="Confirm New Password"
            required
            error={errors.confirmPassword?.message}
          >
            <PasswordInput
              {...register("confirmPassword")}
              placeholder="Re-enter your new password"
              show={show.confirm}
              onToggle={() => toggle("confirm")}
              autoComplete="new-password"
            />
          </FormField>
        </div>

        <Separator className="my-4" />

        <ModalFooter
          onClose={handleClose}
          onSave={handleSubmit(submitHandler)}
          isSaving={isSubmitting}
          saveLabel="Update Password"
        />
      </DialogContent>
    </Dialog>,
    modalRoot,
  );
};
