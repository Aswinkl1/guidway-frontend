import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CurrentToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}

export const CurrentToggle = ({
  checked,
  onChange,
  label = "I currently work here",
}: CurrentToggleProps) => (
  <div className="flex items-center gap-3">
    <Switch checked={checked} onCheckedChange={onChange} id="is-current" />
    <Label
      htmlFor="is-current"
      className="text-sm text-slate-600 cursor-pointer select-none"
    >
      {label}
    </Label>
  </div>
);
