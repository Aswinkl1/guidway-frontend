import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface ModalFooterProps {
  onClose: () => void;
  onSave: () => void;
  isSaving?: boolean;
  saveLabel?: string;
}

export const ModalFooter = ({
  onClose,
  onSave,
  isSaving,
  saveLabel = "Save",
}: ModalFooterProps) => (
  <DialogFooter className="flex gap-2 pt-2">
    <Button
      variant="outline"
      size="sm"
      onClick={onClose}
      className="border-slate-200 text-slate-600 hover:text-slate-900"
    >
      Cancel
    </Button>
    <Button
      size="sm"
      onClick={onSave}
      disabled={isSaving}
      className="bg-slate-900 hover:bg-slate-800 text-white min-w-18"
    >
      {isSaving ? "Saving…" : saveLabel}
    </Button>
  </DialogFooter>
);
