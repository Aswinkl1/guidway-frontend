import { useMutation } from "@tanstack/react-query";
import type { EducationFormData } from "../schemas/education.schema";
import { AddEducation } from "../services/mentorServices";
import toast from "react-hot-toast";

export const useAddEducation = () => {
  return useMutation({
    mutationFn: (data: EducationFormData) => AddEducation(data),

    onSuccess: () => {
      toast.success("Education added!");
    },
  });
};
