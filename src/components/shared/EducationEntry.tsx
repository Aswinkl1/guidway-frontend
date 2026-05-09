import { EducationModal } from "@/features/profile/components/modals";
import { useEditEducation } from "@/features/profile/hooks/useEducationMutation";
import type { EducationFormData } from "@/features/profile/schemas/education.schema";
import type { EducationEntryProps } from "@/types/mentor.types";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

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
}: EducationEntryProps) => {
  const [openModal, setOpenModal] = useState(false);
  const { mutateAsync, isPending } = useEditEducation();
  async function handleSave(data: EducationFormData) {
    await mutateAsync({ ...data, id });
  }
  return (
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
      <div className="flex items-start justify-between py-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">{institution}</p>
          <p className="text-sm text-slate-500">{degree}</p>
          <p className="text-xs text-slate-400 mt-0.5">{startYear}</p>
        </div>
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
            onClick={() => setOpenModal(true)}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </>
  );
};
