import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  DeleteExperienceType,
  EditExperienceType,
  ExperienceFormData,
} from "../schemas/experience.schema";
import {
  AddExperience,
  DeleteExperience,
  EditExperience,
} from "../services/mentorServices";
import toast from "react-hot-toast";
import { QUERYKEY } from "./keys";

export const useAddExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ExperienceFormData) => AddExperience(data),

    onSuccess: () => {
      toast.success("Experience added!");
      queryClient.invalidateQueries({ queryKey: QUERYKEY.all });
    },
    // TODO optimitic update shound be done after you finsish the profile
  });
};

export const useEditExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditExperienceType) => EditExperience(data),

    onSuccess: () => {
      toast.success("Experience edited!");
      queryClient.invalidateQueries({ queryKey: QUERYKEY.all });
    },
    // TODO optimitic update shound be done after you finsish the profile
  });
};

export const useDeleteExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteExperienceType) => DeleteExperience(data),

    onSuccess: () => {
      toast.success("Experience deleted!");
      queryClient.invalidateQueries({ queryKey: QUERYKEY.all });
    },
    // TODO optimitic update shound be done after you finsish the profile
  });
};
