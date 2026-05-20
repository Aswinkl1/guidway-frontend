import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteSession } from "../services/mentorSession.service";
import toast from "react-hot-toast";
import { sessionKeys } from "./useGetSessionQuery";

export const useDeleteSessionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      toast.success("succesfully edited");
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
};
