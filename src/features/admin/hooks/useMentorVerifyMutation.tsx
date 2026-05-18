import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyMentor } from "../services/adminServices";

export const useMentorVerifyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => verifyMentor({ mentorId: id }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "mentor", variables],
      });
    },
  });
};
