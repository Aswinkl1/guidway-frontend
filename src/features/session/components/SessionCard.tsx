import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

const DurationBadge: React.FC<{ minutes: number }> = ({ minutes }) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
    <Clock size={11} />
    {minutes} min
  </span>
);
interface SessionTypeCardProps {
  duration: number; // minutes
  title: string;
  description: string;
  price: number;
  onClick?: () => void;
}

export const SessionTypeCard = ({
  duration,
  title,
  description,
  price,
  onClick,
}: SessionTypeCardProps) => (
  <Card
    onClick={onClick}
    className="shadow-none border border-slate-200 rounded-2xl cursor-pointer
      hover:border-slate-300 hover:shadow-sm transition-all group"
  >
    <CardContent className="p-6 flex flex-col gap-3 h-full">
      <DurationBadge minutes={duration} />

      <div className="flex-1 flex flex-col gap-2">
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
      </div>

      <div className="pt-4 mt-auto">
        <span className="text-xl font-bold text-slate-900">${price}</span>
        <span className="text-sm text-slate-400 ml-1">/ session</span>
      </div>
    </CardContent>
  </Card>
);
