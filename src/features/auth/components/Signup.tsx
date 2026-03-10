import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router";
import { AxiosError } from "axios";
import type { serverErrorv } from "@/types/serverErrors";

const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(50, "Full name must be under 50 characters"),
    email: z.email("Please enter a valid email address"),
    phoneNumber: z
      .string()
      .regex(/^\+?[6-9]\d{9}$/, "Please enter a valid mobile number"),
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

type RawSignupFields = z.infer<typeof signupSchema>;
export type SignupSchemaType = RawSignupFields & {
  role: "mentee" | "mentor";
};
interface SignupProps {
  onSubmit: (data: SignupSchemaType) => Promise<void>;
}
export default function SignupForm({ onSubmit }: SignupProps) {
  const [role, setRole] = useState<"mentee" | "mentor">("mentee");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RawSignupFields>({
    resolver: zodResolver(signupSchema),
  });

  const submitHandler = async (data: RawSignupFields) => {
    try {
      await onSubmit({ ...data, role });
    } catch (error) {
      if (error instanceof AxiosError && error?.response?.data?.errors) {
        const serializedErrors = error.response.data.errors as serverErrorv;

        serializedErrors.forEach((err) => {
          if (err.field == undefined) {
            setError("root.serverError", {
              message: err.message,
              type: "server",
            });
          } else {
            setError(err.field as keyof typeof data, {
              message: err.message,
              type: "server",
            });
          }
        });
      }
    }
    // simulate API call
  };

  return (
    <>
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
      <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-6">
        {(["mentee", "mentor"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${
              role === r
                ? "bg-white text-indigo-600 shadow-sm"
                : "bg-gray-50 text-gray-500 hover:text-gray-700"
            }`}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="space-y-4"
        noValidate
      >
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            {...register("name")}
            type="text"
            placeholder="e.g. Jane Doe"
            className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition ${
              errors.name ? "border-red-400 bg-red-50" : "border-gray-200"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="e.g. jane@example.com"
            className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition ${
              errors.email ? "border-red-400 bg-red-50" : "border-gray-200"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number
          </label>
          <input
            {...register("phoneNumber")}
            type="tel"
            placeholder="9546738296"
            className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition ${
              errors.phoneNumber
                ? "border-red-400 bg-red-50"
                : "border-gray-200"
            }`}
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-xs text-red-500">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition ${
              errors.password ? "border-red-400 bg-red-50" : "border-gray-200"
            }`}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="••••••••"
            className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition ${
              errors.confirmPassword
                ? "border-red-400 bg-red-50"
                : "border-gray-200"
            }`}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg text-sm transition-colors mt-2"
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            or
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          Sign up with Google
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to={"/auth/login"}>
            <span className="text-indigo-600 font-medium hover:underline">
              Log in
            </span>
          </Link>
        </p>
      </form>
    </>
  );
}
