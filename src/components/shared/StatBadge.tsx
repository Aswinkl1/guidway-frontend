import type { StatBadgeProps } from "@/types/mentor.types";

export const StatBadge = ({
  icon,
  value,
  label,
  colorClass,
}: StatBadgeProps) => (
  <div className="flex flex-col items-center gap-0.5">
    <div
      className={`flex items-center gap-1.5 text-base font-semibold ${colorClass}`}
    >
      <span className="w-4 h-4 flex items-center justify-center">{icon}</span>
      {value}
    </div>
    <span className="text-xs text-slate-400 uppercase tracking-wide">
      {label}
    </span>
  </div>
);
