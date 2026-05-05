import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 60 }, (_, i) => CURRENT_YEAR - i);

interface MonthYearPickerProps {
  monthValue: number | "";
  yearValue: number | "";
  onMonthChange: (v: number | "") => void;
  onYearChange: (v: number | "") => void;
  disabled?: boolean;
  error?: string;
}

export const MonthYearPicker = ({
  monthValue,
  yearValue,
  onMonthChange,
  onYearChange,
  disabled,
  error,
}: MonthYearPickerProps) => (
  <div className="flex gap-2">
    <Select
      disabled={disabled}
      value={monthValue !== "" ? String(monthValue) : ""}
      onValueChange={(v) => onMonthChange(v ? Number(v) : "")}
    >
      <SelectTrigger className="flex-1 h-9 text-sm border-slate-200">
        <SelectValue placeholder="Month" />
      </SelectTrigger>
      <SelectContent>
        {MONTHS.map((m, i) => (
          <SelectItem key={m} value={String(i + 1)} className="text-sm">
            {m}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Select
      disabled={disabled}
      value={yearValue !== "" ? String(yearValue) : ""}
      onValueChange={(v) => onYearChange(v ? Number(v) : "")}
    >
      <SelectTrigger className="w-28 h-9 text-sm border-slate-200">
        <SelectValue placeholder="Year" />
      </SelectTrigger>
      <SelectContent className="max-h-52 overflow-y-auto">
        {YEARS.map((y) => (
          <SelectItem key={y} value={String(y)} className="text-sm">
            {y}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    {error && (
      <p className="flex items-center gap-1 text-xs text-red-500 col-span-2">
        <AlertCircle size={11} /> {error}
      </p>
    )}
  </div>
);
