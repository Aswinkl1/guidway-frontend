import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSession } from "../services/mentorSession.service";
import toast from "react-hot-toast";
import { sessionKeys } from "./useGetSessionQuery";

export const useAddSessionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addSession,
    onSuccess: () => {
      toast.success("session added succesfully");
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
};
