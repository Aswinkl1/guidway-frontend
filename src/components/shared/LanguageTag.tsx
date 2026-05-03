import type { LanguageTagProps } from "@/types/mentor.types";
import { Languages } from "lucide-react";

export const LanguageTag = ({ lang, level }: LanguageTagProps) => (
  <div className="flex items-center gap-1.5 border border-slate-200 rounded-full px-3 py-1 text-sm text-slate-600 bg-white">
    <Languages size={13} className="text-slate-400" />
    <span>{lang}</span>
    <span className="text-slate-400">•</span>
    <span className="text-slate-400">{level}</span>
  </div>
);
