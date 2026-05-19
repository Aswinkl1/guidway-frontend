import { EducationModal } from "@/features/profile/components/modals";
import {
  useDeleteEducation,
  useEditEducation,
} from "@/features/profile/hooks/useEducationMutation";
import type { EducationFormData } from "@/features/profile/schemas/education.schema";
import type { EducationEntryProps } from "@/types/mentor.types";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "../modals/ConfirmDialog";

export const EducationEntry = ({
  institution,
  degree,
  startYear,
  endYear,
  grade,
  description,
  endMonth,
  fieldOfStudy,
  id,
  isCurrent,
  startMonth,
  showActions = false,
}: EducationEntryProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [openDel, setOpenDel] = useState(false);

  const { mutateAsync, isPending } = useEditEducation();
  const { mutateAsync: mutateAsyncForEducationDelete } = useDeleteEducation();
  async function handleSave(data: EducationFormData) {
    await mutateAsync({ ...data, id });
  }
  return (
    <>
      {showActions && (
        <>
          <EducationModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            onSave={handleSave}
            initialData={{
              institution,
              degree,
              description,
              startMonth,
              startYear,
              endMonth,
              endYear,
              fieldOfStudy,
              grade,
              isCurrent,
            }}
          />

          <ConfirmDialog
            title="Delete Education"
            description="This action cannot be undone. Proceed with deletion?"
            onCancel={() => {
              setOpenDel(false);
            }}
            onConfirm={() => {
              mutateAsyncForEducationDelete({ id });
            }}
            open={openDel}
            cancelLabel="Cancel"
            confirmLabel="Delete"
          />
        </>
      )}

      <div className="flex items-start justify-between py-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">{institution}</p>
          <p className="text-sm text-slate-500">{degree}</p>
          <p className="text-xs text-slate-400 mt-0.5">{startYear}</p>
        </div>

        {showActions && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Grade: {grade}</span>
            <button
              className="text-slate-300 hover:text-slate-500"
              onClick={() => setOpenModal(true)}
            >
              <Pencil size={14} />
            </button>
            <button
              className="text-slate-300 hover:text-slate-500"
              onClick={() => setOpenDel(true)}
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
