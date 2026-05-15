import { WifiOff, RefreshCw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { ErrorLayout, ErrorActions } from "./ErrorAction";

export const ServerErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const handleRetry = () => window.location.reload();

  return (
    <ErrorLayout>
      {/* Illustration */}
      <div className="relative mb-8 select-none">
        <p
          className="text-[160px] sm:text-[200px] font-black text-slate-100 leading-none tracking-tighter"
          aria-hidden
        >
          500
        </p>

        {/* Centered icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white border border-red-100 rounded-2xl shadow-sm flex items-center justify-center">
            <WifiOff size={28} className="text-red-400" />
          </div>
        </div>
      </div>

      {/* Copy */}
      <div className="text-center max-w-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Our servers ran into an unexpected problem. This is on us — please try
          again in a moment.
        </p>
      </div>

      {/* Status pill */}
      <div className="flex items-center gap-2 mt-5 px-4 py-2 bg-red-50 border border-red-100 rounded-full">
        <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse shrink-0" />
        <p className="text-xs text-red-600 font-medium">
          Internal server error
        </p>
      </div>

      {/* Actions */}
      <ErrorActions
        primaryLabel="Try again"
        primaryAction={handleRetry}
        primaryIcon={<RefreshCw size={15} />}
        secondaryLabel="Go back"
        secondaryAction={() => navigate(-1)}
        secondaryIcon={<ArrowLeft size={15} />}
      />

      {/* Footer hint */}
      <p className="text-xs text-slate-400 mt-10 text-center">
        If this keeps happening,{" "}
        <a
          href="mailto:support@mentorspace.com"
          className="text-blue-500 hover:underline"
        >
          contact support
        </a>
        .
      </p>
    </ErrorLayout>
  );
};
