import { ConfirmDialog } from "@/components/modals/ConfirmDialog";

interface BlockUserModalProps {
  open: boolean;
  userName: string;
  action: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const BlockUserModal = ({
  open,
  userName,
  action,
  onConfirm,
  onCancel,
}: BlockUserModalProps) => {
  const isBlocking = action === "block";
  return (
    <ConfirmDialog
      open={open}
      title={isBlocking ? "Block User?" : "UnBlock User"}
      description={`Are you sure you want to ${action} ${userName}?`}
      confirmLabel="Confirm"
      cancelLabel="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};
