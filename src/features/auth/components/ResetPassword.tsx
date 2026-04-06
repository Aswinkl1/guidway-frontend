import { useForm } from "react-hook-form";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Info } from "lucide-react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleServerErrors } from "@/helpers/formErrorHelper";

type ResetPassowordProb = {
  onSubmit: (
    data: Omit<ResetPasswordPayload, "confirmPassword">,
  ) => Promise<void>;
};

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordPayload = z.infer<typeof resetSchema>;

export function ResetPassword({ onSubmit }: ResetPassowordProb) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordPayload>({
    resolver: zodResolver(resetSchema),
  });

  const submitHandler = async (data: ResetPasswordPayload) => {
    try {
      await onSubmit({ password: data.password });
    } catch (error) {
      handleServerErrors(error, setError, data);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm px-8 py-10 flex flex-col gap-6">
        {/* Heading */}
        <div className="flex flex-col items-center text-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Create new password
          </h1>
          <p className="text-sm text-gray-500">
            Please enter a new password for your account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(submitHandler)}
          className="flex flex-col gap-4"
        >
          {/* New Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                {...register("password")}
                className={`w-full border bg-gray-50 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.password ? "border-red-400" : "border-gray-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your new password"
                {...register("confirmPassword")}
                className={`w-full border bg-gray-50 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.confirmPassword ? "border-red-400" : "border-gray-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Hint */}
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-gray-300 shrink-0" />
            <p className="text-xs text-gray-400">
              Password must be at least 8 characters.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-3 rounded-lg transition-colors mt-2"
          >
            Reset password
          </button>
        </form>

        {/* Back to Login */}
        <button className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Login
        </button>
      </div>
    </div>
  );
}
