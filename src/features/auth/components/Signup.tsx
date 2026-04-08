import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router";

import { handleServerErrors } from "@/helpers/formErrorHelper";

const GoogleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      fill="#34A853"
    />
    <path
      d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"
      fill="#EA4335"
    />
  </svg>
);
const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
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

export type SignupPayload = RawSignupFields & {
  role: "mentee" | "mentor";
};

interface SignupProps {
  onSubmit: (data: SignupPayload) => Promise<void>;
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
      handleServerErrors(error, setError, data);
    }
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
            className={` cursor-pointer flex-1 py-2 text-sm font-medium capitalize transition-colors ${
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
          className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg text-sm transition-colors mt-2"
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

        {role === "mentor" ? (
          <a href="http://localhost:3000/api/v1/auth/linkedin">
            <button
              type="button"
              className="cursor-pointer w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <LinkedInIcon className="w-4.5 h-4.5 text-[#0A66C2]" />
              Sign up with LinkedIn
            </button>
          </a>
        ) : (
          <a href="http://localhost:3000/api/v1/auth/google">
            <button className="w-full flex items-center justify-center gap-2.5 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <GoogleIcon />
              Login with Google
            </button>
          </a>
        )}

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
