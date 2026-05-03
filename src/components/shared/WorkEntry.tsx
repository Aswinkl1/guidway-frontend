import type { WorkEntryProps } from "@/types/mentor.types";
import { Pencil } from "lucide-react";

export const WorkEntry = ({
  company,
  role,
  period,
  duration,
}: WorkEntryProps) => (
  <div className="flex items-start justify-between py-3">
    <div>
      <p className="text-sm font-semibold text-slate-800">{company}</p>
      <p className="text-sm text-slate-500">{role}</p>
      <p className="text-xs text-slate-400 mt-0.5">
        {period} · {duration}
      </p>
    </div>
    <button className="text-slate-300 hover:text-slate-500 mt-0.5">
      <Pencil size={14} />
    </button>
  </div>
);
