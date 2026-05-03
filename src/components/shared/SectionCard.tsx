import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { SectionCardProps } from "@/types/mentor.types";

export const SectionCard = ({
  title,
  actionLabel,
  onAction,
  children,
}: SectionCardProps) => (
  <Card className="shadow-none border border-slate-200 rounded-2xl">
    <CardHeader className="flex flex-row items-center justify-between pb-3 pt-5 px-6">
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
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
