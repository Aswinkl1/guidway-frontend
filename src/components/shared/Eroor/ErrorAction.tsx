import { Button } from "@/components/ui/button";

interface ErrorLayoutProps {
  children: React.ReactNode;
}

export const ErrorLayout: React.FC<ErrorLayoutProps> = ({ children }) => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
    {children}
  </div>
);

interface ErrorActionsProps {
  primaryLabel: string;
  primaryAction: () => void;
  primaryIcon: React.ReactNode;
  secondaryLabel?: string;
  secondaryAction?: () => void;
  secondaryIcon?: React.ReactNode;
}

export const ErrorActions = ({
  primaryLabel,
  primaryAction,
  primaryIcon,
  secondaryLabel,
  secondaryAction,
  secondaryIcon,
}: ErrorActionsProps) => (
  <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
    <Button
      onClick={primaryAction}
      className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-5 h-10 gap-2 font-medium"
    >
      {primaryIcon}
      {primaryLabel}
    </Button>

    {secondaryLabel && secondaryAction && (
      <Button
        variant="outline"
        onClick={secondaryAction}
        className="border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl px-5 h-10 gap-2 font-medium"
      >
        {secondaryIcon}
        {secondaryLabel}
      </Button>
    )}
  </div>
);
