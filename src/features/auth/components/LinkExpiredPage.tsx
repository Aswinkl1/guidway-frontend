import { AlertCircle } from "lucide-react";
import { Link } from "react-router";

export function LinkExpiredPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm px-10 py-10 flex flex-col items-center text-center gap-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-1">
          <AlertCircle className="w-5 h-5 text-red-400" strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <h1 className="text-xl font-semibold text-blue-600 tracking-tight">
          Reset link expired
        </h1>

        {/* Body */}
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
          The password reset link is no longer valid or has expired. Please
          request a new link to continue.
        </p>

        {/* Back to log in */}
        <Link
          to="/auth/login"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors mt-1"
        >
          Back to log in
        </Link>
      </div>
    </div>
  );
}
