import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ChipProps {
  title: string;

  inputValue?: any;

  onInputChange?: (data: any) => void;

  error?: string;

  onRemove: () => void;

  children?: ReactNode;
}

export const Chip = ({
  title,
  inputValue,
  onInputChange,
  error,
  onRemove,
  children,
}: ChipProps) => {
  return (
    <>
      <div
        className={`flex items-center gap-2 rounded-xl border px-3 py-2 bg-white transition-colors ${
          error
            ? "border-red-300 bg-red-50"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <span className="text-sm font-medium text-slate-800 flex-1 min-w-0 truncate">
          {title}
        </span>

        {/* custom content */}
        {children ? (
          children
        ) : (
          <div className="flex items-center gap-1 shrink-0">
            <input
              type="number"
              min={0}
              max={50}
              placeholder="Yrs"
              value={inputValue ?? ""}
              onChange={(e) =>
                onInputChange?.(
                  e.target.value !== "" ? Number(e.target.value) : undefined,
                )
              }
              className={`w-14 h-7 rounded-lg border text-xs text-center text-slate-700 bg-slate-50
              focus:outline-none focus:ring-1 focus:ring-slate-300 placeholder:text-slate-400
              ${error ? "border-red-300" : "border-slate-200"}`}
            />

            <span className="text-xs text-slate-400 hidden sm:block">yrs</span>
          </div>
        )}

        <button
          type="button"
          onClick={onRemove}
          className="ml-1 w-5 h-5 rounded-full flex items-center justify-center
          text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
          aria-label={`Remove ${title}`}
        >
          <X size={12} />
        </button>
      </div>
    </>
  );
};
