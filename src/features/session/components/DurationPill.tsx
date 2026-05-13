interface DurationPillProps {
  value: number;
  selected: boolean;
  onSelect: (v: number) => void;
}

export const DurationPill = ({
  value,
  selected,
  onSelect,
}: DurationPillProps) => (
  <button
    type="button"
    onClick={() => onSelect(value)}
    className={`h-8 px-3 rounded-lg text-xs font-medium border transition-colors ${
      selected
        ? "bg-slate-900 text-white border-slate-900"
        : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-800"
    }`}
  >
    {value} min
  </button>
);
