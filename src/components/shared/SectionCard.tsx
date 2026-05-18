import { Card, CardContent, CardHeader } from "../ui/card";

export interface SectionCardProps {
  title: string;
  icon?: React.ReactNode;
  actionLabel?: React.ReactNode;
  onAction?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  icon,
  actionLabel,
  onAction,
  children,
  className = "",
}) => (
  <Card
    className={`shadow-none border border-slate-200 rounded-2xl ${className}`}
  >
    <CardHeader className="flex flex-row items-center justify-between pb-3 pt-5 px-6">
      <div className="flex items-center gap-2">
        {icon && (
          <span className="text-slate-400 w-4 h-4 flex items-center justify-center shrink-0">
            {icon}
          </span>
        )}
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      </div>
      {onAction && (
        <button
          onClick={onAction}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          {actionLabel}
        </button>
      )}
    </CardHeader>
    <CardContent className="px-6 pb-5">{children}</CardContent>
  </Card>
);
