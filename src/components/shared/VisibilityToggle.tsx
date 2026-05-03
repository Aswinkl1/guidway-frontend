import { Switch } from "@/components/ui/switch";
import type { VisibilityToggleProps } from "@/types/mentor.types";

export const VisibilityToggle = ({
  label,
  subtitle,
  checked,
  onChange,
}: VisibilityToggleProps) => (
  <div className="flex items-center justify-between py-2">
    <div>
      <p className="text-sm font-medium text-slate-700">{label}</p>
      <p className="text-xs text-slate-400">{subtitle}</p>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);
