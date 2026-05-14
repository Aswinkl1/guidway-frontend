import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editSession } from "../services/mentorSession.service";
import toast from "react-hot-toast";
import { sessionKeys } from "./useGetSessionQuery";

export const useEditSessionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
      toast.success("succesfully edited");
    },
  });
};
