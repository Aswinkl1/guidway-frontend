import type { AwardEntryProps } from "@/types/mentor.types";
import { Pencil } from "lucide-react";

export const AwardEntry = ({ title, type, year }: AwardEntryProps) => (
  <div className="flex items-start justify-between py-3">
    <div>
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <p className="text-xs text-slate-400">
        {type} · {year}
      </p>
    </div>
    <button className="text-slate-300 hover:text-slate-500">
      <Pencil size={14} />
    </button>
  </div>
);
