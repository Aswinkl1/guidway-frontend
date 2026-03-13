import type { serverErrorv } from "@/types/serverErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import z, { keyof } from "zod";

const loginSchema = z.object({
  email: z.email("please enter a valid email"),
  password: z
    .string("Password is required.")
    .trim()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number."),
});

type LoginSchemaType = z.infer<typeof loginSchema>;
interface EyeIconProps {
  open: boolean;
}

interface LoginProps {
  onSubmit: (data: any) => Promise<void>; // A function that takes data and returns nothing
  isLoading: boolean; // A simple true/false
}
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

const EyeIcon = ({ open }: EyeIconProps) =>
  open ? (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

export const Login = ({ onSubmit, isLoading }: LoginProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const submitHandler = async (data: LoginSchemaType) => {
    try {
      await onSubmit(data);
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
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">
        Log in to your account
      </h1>
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
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
          <input
            type="text"
            placeholder="name@example.com"
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-gray-900 placeholder-gray-400 outline-none transition-all
                  ${
                    errors.email
                      ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                  }`}
            {...register("email", {
              required: "Email is required",
            })}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">
              {String(errors?.email?.message)}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Link
              to={"/auth/forget-password"}
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={`w-full px-3.5 py-2.5 pr-10 rounded-lg border text-sm text-gray-900 placeholder-gray-400 outline-none transition-all
                    ${
                      errors.password
                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                    }`}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">
              {String(errors.password.message)}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg text-sm transition-colors mt-2 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Logging in...
            </>
          ) : (
            "Log in"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400 uppercase tracking-wide">
          or
        </span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Google */}
      <button className="w-full flex items-center justify-center gap-2.5 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
        <GoogleIcon />
        Login with Google
      </button>

      {/* Sign up */}
      <p className="text-center text-sm text-gray-500 mt-5">
        Don't have an account?{" "}
        <Link to={"/auth/signup"}>
          <button className=" cursor-pointer text-blue-600 hover:text-blue-700 font-semibold transition-colors">
            Sign up
          </button>
        </Link>
      </p>
    </div>
  );
};
