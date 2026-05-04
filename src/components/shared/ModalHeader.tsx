import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ModalHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export const ModalHeader = ({ icon, title, subtitle }: ModalHeaderProps) => (
  <DialogHeader className="pb-0">
    <div className="flex items-center gap-3 mb-1">
      <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
        {icon}
      </div>
      <div>
        <DialogTitle className="text-base font-semibold text-slate-900 leading-tight">
          {title}
        </DialogTitle>
        <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
      </div>
    </div>
  </DialogHeader>
);
