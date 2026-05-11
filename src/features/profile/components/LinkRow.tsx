import { Input } from "@/components/ui/input";
import { LinkIcon, Trash2, AlertCircle } from "lucide-react";

interface LinkRowProps {
  index: number;
  value: string;
  onChange: (v: string) => void;
  onRemove: () => void;
  error?: string;
  canRemove: boolean;
}
export const LinkRow = ({
  index,
  value,
  onChange,
  onRemove,
  error,
  canRemove,
}: LinkRowProps) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <LinkIcon
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`https://link${index + 1}.com`}
          className={`h-9 pl-8 text-sm ${error ? "border-red-300" : "border-slate-200"}`}
        />
      </div>
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="w-8 h-8 flex items-center justify-center rounded-lg
            text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
          aria-label={`Remove link ${index + 1}`}
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
    {error && (
      <p className="flex items-center gap-1 text-xs text-red-500">
        <AlertCircle size={11} /> {error}
      </p>
    )}
  </div>
);
