import type { NavItemProps } from "@/types/mentor.types";

export const NavItem = ({ icon, label, active = false }: NavItemProps) => (
  <button
    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
      active
        ? "bg-slate-900 text-white font-medium"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`}
  >
    <span className="w-4 h-4 flex items-center justify-center shrink-0">
      {icon}
    </span>
    <span>{label}</span>
  </button>
);
