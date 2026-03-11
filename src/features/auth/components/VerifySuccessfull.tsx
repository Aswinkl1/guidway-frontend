import { CheckCircle } from "lucide-react";
import { Link } from "react-router";

export function VerifySuccessPage({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm px-10 py-10 flex flex-col items-center text-center gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-1">
          <CheckCircle className="w-6 h-6 text-green-500" strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <h1 className="text-xl font-bold text-blue-600 tracking-tight">
          {title}
          {/* Password reset successful */}
        </h1>

        {/* Body */}
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
          {message}
          {/* Your password has been updated. You can now log in to your account
          with your new credentials. */}
        </p>

        {/* CTA Button */}
        <Link
          to="/auth/login"
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-3 rounded-lg transition-colors"
        >
          Back to log in
        </Link>
      </div>
    </div>
  );
}
