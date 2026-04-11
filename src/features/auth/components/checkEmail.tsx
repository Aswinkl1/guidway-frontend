import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export function CheckEmailPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md px-10 py-10 flex flex-col items-center text-center gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1">
          <Mail className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Check your email
        </h1>

        {/* Body */}
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
          We've sent a verification link to{" "}
          <span className="font-semibold text-gray-800">
            alex.johnson@example.com
          </span>
          <br />
          Please click the link in your email to continue setting up your
          password.
        </p>

        {/* Footer links */}
        <div className="flex flex-col items-center gap-1.5 mt-1">
          <p className="text-sm text-gray-400">
            Didn't receive the email?{" "}
            <Link
              to={"/auth/signup"}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Resend email
            </Link>
          </p>
          <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Wrong email address?
          </button>
        </div>
      </div>
    </div>
  );
}
