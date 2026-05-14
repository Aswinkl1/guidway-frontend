import { useMutation } from "@tanstack/react-query";
import { editSession } from "../services/mentorSession.service";
import toast from "react-hot-toast";

export const useEditSessionMutation = () => {
  return useMutation({
    mutationFn: editSession,
    onSuccess: () => {
      toast.success("succesfully edited");
    },
  });
};
