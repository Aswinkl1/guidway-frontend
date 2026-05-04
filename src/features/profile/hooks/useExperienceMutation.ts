import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ExperienceFormData } from "../schemas/experience.schema";
import { AddExperience } from "../services/mentorServices";
import toast from "react-hot-toast";

export const useAddExperience = () => {
  //const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ExperienceFormData) => AddExperience(data),

    onSuccess: () => {
      toast.success("Experience added!");
    },
    // TODO optimitic update shound be done after you finsish the profile
  });
};
