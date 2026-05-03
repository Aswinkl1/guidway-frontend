import { Badge } from "@/components/ui/badge";
import type { SkillTagProps } from "@/types/mentor.types";

export const SkillTag = ({ label }: SkillTagProps) => (
  <Badge
    variant="outline"
    className="rounded-full border-slate-300 text-slate-600 bg-white text-xs px-3 py-1"
  >
    {label}
  </Badge>
);
