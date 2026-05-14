import { QueryClient, useMutation } from "@tanstack/react-query";
import { deleteSession } from "../services/mentorSession.service";
import toast from "react-hot-toast";

export const useDeleteSessionMutation = () => {
  return useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      toast.success("succesfully edited");
    },
  });
};
