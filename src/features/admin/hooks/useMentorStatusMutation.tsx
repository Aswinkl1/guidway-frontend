import { useMutation } from "@tanstack/react-query";
import type { MentorStatus } from "../types/mentor.types";
import { updateMentorstatus } from "../services/adminServices";

export const useMentorStatus = () => {
  return useMutation({
    mutationFn: (data: { id: string; status: MentorStatus }) => {
      return updateMentorstatus(data);
    },
  });
};
