import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { EducationFormData } from "../schemas/education.schema";
import { AddEducation } from "../services/mentorServices";
import toast from "react-hot-toast";
import { QUERYKEY } from "./keys";

export const useAddEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EducationFormData) => AddEducation(data),

    onSuccess: () => {
      toast.success("Education added!");
      queryClient.invalidateQueries({ queryKey: QUERYKEY.all });
    },
  });
};
