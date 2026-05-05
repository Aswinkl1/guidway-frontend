import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField = ({
  label,
  required,
  error,
  children,
  className = "",
}: FormFieldProps) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <Label className="text-sm font-medium text-slate-700">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </Label>
    {children}
    {error && (
      <p className="flex items-center gap-1 text-xs text-red-500">
        <AlertCircle size={11} /> {error}
      </p>
    )}
  </div>
);
