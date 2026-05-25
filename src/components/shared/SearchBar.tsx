import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
  className = "",
}: SearchBarProps) => (
  <div className={`relative w-full ${className}`}>
    <Search
      size={15}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
    />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-9 pl-9 pr-8 rounded-xl border border-slate-200 bg-white
        text-sm text-slate-800 placeholder:text-slate-400
        focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400
        transition-all"
    />
    {value && (
      <button
        onClick={onClear}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        aria-label="Clear search"
      >
        <X size={13} />
      </button>
    )}
  </div>
);
