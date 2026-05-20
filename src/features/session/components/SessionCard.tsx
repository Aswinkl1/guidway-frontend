import { Card, CardContent } from "@/components/ui/card";
import { Clock, Pencil, Trash2 } from "lucide-react";
import { CreateSessionModal } from "./modal/createSessionModal";
import { useState } from "react";
import { useEditSessionMutation } from "../hooks/useEditSessionMutation";
import type { CreateSessionDTO } from "../schema/session.dto";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { useDeleteSessionMutation } from "../hooks/useDeleteSessionMutation";

import { CheckCircle2, XCircle } from "lucide-react"; // Assuming you are using lucide-react

const StatusBadge: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
        isActive
          ? "bg-emerald-100 text-emerald-700"
          : "bg-slate-100 text-slate-700"
      }`}
    >
      {isActive ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
      {isActive ? "Active" : "Inactive"}
    </span>
  );
};
const DurationBadge: React.FC<{ minutes: number }> = ({ minutes }) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
    <Clock size={11} />
    {minutes} min
  </span>
);
interface SessionTypeCardProps {
  id: string;
  duration: number; // minutes
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  onClick?: () => void;
}

export const SessionTypeCard = ({
  id,
  duration,
  name,
  description,
  price,
  isActive,
  onClick,
}: SessionTypeCardProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const { mutateAsync: mutateAsyncForEdit } = useEditSessionMutation();
  const { mutateAsync: mutateAsyncForDelete } = useDeleteSessionMutation();
  async function handleSave(data: CreateSessionDTO) {
    await mutateAsyncForEdit({ ...data, id });
  }
  return (
    <>
      <CreateSessionModal
        open={openModal}
        initialData={{ description, name, duration, isActive, price }}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        title="Delete Session"
        description="This action cannot be undone. Proceed with deletion?"
        onCancel={() => {
          setOpenDel(false);
        }}
        onConfirm={() => {
          mutateAsyncForDelete({ id });
        }}
        open={openDel}
        cancelLabel="Cancel"
        confirmLabel="Delete"
      />
      <Card
        onClick={onClick}
        className="shadow-none border  border-slate-200 rounded-2xl cursor-pointer
      hover:border-slate-300 hover:shadow-sm transition-all group"
      >
        <CardContent className="p-6 flex flex-col gap-3 h-full">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <DurationBadge minutes={duration} />
              <StatusBadge isActive={isActive} />
            </div>
            <div className=" flex gap-4">
              <button onClick={() => setOpenModal(true)}>
                <Pencil size={14} />
              </button>

              <button onClick={() => setOpenDel(true)}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {name}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="pt-4 mt-auto">
            <span className="text-xl font-bold text-slate-900">${price}</span>
            <span className="text-sm text-slate-400 ml-1">/ session</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
