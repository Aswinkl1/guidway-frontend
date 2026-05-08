import { Loader2 } from "lucide-react";

export const DropdownLoading: React.FC = () => (
  <div className="flex items-center justify-center gap-2 px-4 py-4">
    <Loader2 size={14} className="animate-spin text-slate-400" />
    <span className="text-sm text-slate-400">Loading skills…</span>
  </div>
);

interface DropdownErrorProps {
  onRetry: () => void;
}

export const DropdownError: React.FC<DropdownErrorProps> = ({ onRetry }) => (
  <div className="flex flex-col items-center gap-2 px-4 py-4 text-center">
    <p className="text-sm text-red-500">Failed to load skills</p>
    <button
      type="button"
      onClick={onRetry}
      className="text-xs text-blue-600 hover:underline"
    >
      Try again
    </button>
  </div>
);

interface DropdownEmptyProps {
  query: string;
}

export const DropdownEmpty: React.FC<DropdownEmptyProps> = ({ query }) => (
  <p className="px-4 py-3 text-sm text-slate-400 text-center">
    {query ? "No skills match your search" : "All skills are already selected"}
  </p>
);
