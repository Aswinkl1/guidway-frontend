import { useMutation } from "@tanstack/react-query";
import { addSession } from "../services/mentorSession.service";
import toast from "react-hot-toast";

export const useAddSessionMutation = () => {
  return useMutation({
    mutationFn: addSession,
    onSuccess: () => {
      toast.success("session added succesfully");
      // refetch the data
    },
  });
};
