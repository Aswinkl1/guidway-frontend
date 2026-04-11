import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, History } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { CheckEmailPage } from "../components/checkEmail";
import { handleServerErrors } from "@/helpers/formErrorHelper";
import { useState } from "react";
import { forgetPassword } from "../services/authService";
import { useNavigate } from "react-router";
import { CLIENT_ROUTES } from "@/constants/clientRoutes";

const forgetPasswordEmailSchema = z.object({
  email: z.email("please enter a valid email"),
});

export type forgetPasswordPayload = z.infer<typeof forgetPasswordEmailSchema>;

export function ForgotPasswordPage() {
  const [isReqestSuccessFull, setIsReqestSuccessFull] = useState(false);
  const navigate = useNavigate();
  async function onSubmit(data: forgetPasswordPayload) {
    try {
      await forgetPassword(data);
      setIsReqestSuccessFull(true);
    } catch (error) {
      handleServerErrors(error, setError, data);
    }
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(forgetPasswordEmailSchema),
  });
  // if the req was successfull show them the email check page
  if (isReqestSuccessFull) return <CheckEmailPage />;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm px-8 py-10 flex flex-col items-center text-center gap-5">
        {/* Icon */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <History className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-gray-800 rounded-sm" />
            <span className="text-sm font-medium text-gray-800">
              MentorConnect
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Forgot password?
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Enter your email address and we will send you a link to reset your
            password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className=" w-full space-y-4">
          <div className="w-full flex flex-col gap-2 text-left">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              // type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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

          {/* Submit */}
          <button className=" cursor-pointer w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-3 rounded-lg transition-colors">
            Send reset link
          </button>
        </form>

        {/* Back to log in */}
        <button
          onClick={() => navigate(CLIENT_ROUTES.AUTH.LOGIN)}
          className="cursor-pointer flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to log in
        </button>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400">
        Secure 256-bit SSL encrypted connection
      </p>
    </div>
  );
}
