import { ExperienceModal } from "@/features/profile/components/modals";
import {
  useDeleteExperience,
  useEditExperience,
} from "@/features/profile/hooks/useExperienceMutation";

import type { ExperienceFormData } from "@/features/profile/schemas/experience.schema";
import type { WorkEntryProps } from "@/types/mentor.types";

import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { ConfirmDialog } from "../modals/ConfirmDialog";

export const WorkEntry = ({
  id,
  company,
  role,
  employmentType,
  startMonth,
  startYear,
  endMonth,
  endYear,
  isCurrent,
  description,
  showActions = false,
}: WorkEntryProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [openDel, setOpenDel] = useState(false);

  const { mutateAsync } = useEditExperience();

  const { mutateAsync: mutateAsyncForExperienceDelete } = useDeleteExperience();

  async function handleSave(data: ExperienceFormData) {
    await mutateAsync({ ...data, id });
  }

  return (
    <>
      {showActions && (
        <>
          <ExperienceModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            onSave={handleSave}
            initialData={{
              company,
              role,
              employmentType,
              startMonth,
              startYear,
              endMonth,
              endYear,
              isCurrent,
              description,
            }}
          />

          <ConfirmDialog
            title="Delete Experience"
            description="This action cannot be undone. Proceed with deletion?"
            open={openDel}
            onCancel={() => setOpenDel(false)}
            onConfirm={() => {
              mutateAsyncForExperienceDelete({ id });
            }}
            cancelLabel="Cancel"
            confirmLabel="Delete"
          />
        </>
      )}

      <div className="flex items-start justify-between py-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">{company}</p>

          <p className="text-sm text-slate-500">{role}</p>

          <p className="text-xs text-slate-400 mt-0.5">
            {startYear} · {endYear}
          </p>
        </div>
        {showActions && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">{employmentType}</span>

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
