import type { QuickActionRowProps } from "@/types/mentor.types";
import { ChevronRight } from "lucide-react";

export const QuickActionRow = ({
  icon,
  title,
  subtitle,
  handler,
}: QuickActionRowProps) => (
  <button
    className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-slate-50 transition-colors group"
    onClick={handler}
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
        {icon}
      </div>
      <div className="text-left">
        <p className="text-sm font-medium text-slate-800">{title}</p>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
    </div>
    <ChevronRight
      size={16}
      className="text-slate-300 group-hover:text-slate-400"
    />
  </button>
);
