import {
  useDeleteAchievement,
  useEditAchievement,
} from "@/features/profile/hooks/useAchievementMutation";
import type { AchievementFormData } from "@/features/profile/schemas/achievement.schema";
import type { AwardEntryProps } from "@/types/mentor.types";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "../modals/ConfirmDialog";
import { AchievementModal } from "@/features/profile/components/modals";

export const AwardEntry = ({
  title,
  type,
  year,
  id,
  showActions = false,
}: AwardEntryProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [openDel, setOpenDel] = useState(false);

  const { mutateAsync } = useEditAchievement();

  const { mutateAsync: mutateAsyncForDelete } = useDeleteAchievement();

  async function handleSave(data: AchievementFormData) {
    await mutateAsync({
      ...data,
      id,
    });
  }

  return (
    <>
      {showActions && (
        <>
          <AchievementModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            onSave={handleSave}
            initialData={{
              title,
              type,
              year,
            }}
          />

          <ConfirmDialog
            title="Delete Achievement"
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
        </>
      )}

      <div className="flex items-start justify-between py-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">{title}</p>

          <p className="text-xs text-slate-400">
            {type} · {year}
          </p>
        </div>

        {showActions && (
          <div className="flex items-center gap-3">
            <button
              className="text-slate-300 hover:text-slate-500"
              onClick={() => setOpenModal(true)}
            >
              <Pencil size={14} />
            </button>

            <button
              className="text-slate-300 hover:text-red-500"
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
