import { Search, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router";
import { ErrorLayout, ErrorActions } from "./ErrorAction";

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ErrorLayout>
      {/* Illustration */}
      <div className="relative mb-8 select-none">
        {/* Large faded number */}
        <p
          className="text-[160px] sm:text-[200px] font-black text-slate-100 leading-none tracking-tighter"
          aria-hidden
        >
          404
        </p>

        {/* Centered icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-center">
            <Search size={28} className="text-slate-400" />
          </div>
        </div>
      </div>

      {/* Copy */}
      <div className="text-center max-w-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Page not found
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
          Double-check the URL or head back home.
        </p>
      </div>

      {/* Actions */}
      <ErrorActions
        primaryLabel="Go back"
        primaryAction={() => navigate(-1)}
        primaryIcon={<ArrowLeft size={15} />}
        secondaryLabel="Home"
        secondaryAction={() => navigate("/")}
        secondaryIcon={<Home size={15} />}
      />

      {/* Footer hint */}
      <p className="text-xs text-slate-400 mt-10 text-center">
        If you think this is a mistake,{" "}
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
