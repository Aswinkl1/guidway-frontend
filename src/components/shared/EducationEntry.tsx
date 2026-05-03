import type { EducationEntryProps } from "@/types/mentor.types";
import { Pencil } from "lucide-react";

export const EducationEntry = ({
  school,
  degree,
  years,
  gpa,
}: EducationEntryProps) => (
  <div className="flex items-start justify-between py-3">
    <div>
      <p className="text-sm font-semibold text-slate-800">{school}</p>
      <p className="text-sm text-slate-500">{degree}</p>
      <p className="text-xs text-slate-400 mt-0.5">{years}</p>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400">Grade: {gpa}</span>
      <button className="text-slate-300 hover:text-slate-500">
        <Pencil size={14} />
      </button>
    </div>
  </div>
);
