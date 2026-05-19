import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AchievementFormData } from "../schemas/achievement.schema";
import {
  AddAchievement,
  deleteAchievement,
  editAchievement,
} from "../services/mentorServices";
import toast from "react-hot-toast";
import { QUERYKEY } from "./keys";

export const useAddAchievement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AchievementFormData) => AddAchievement(data),

    onSuccess: () => {
      toast.success("achievement added ");
      queryClient.invalidateQueries({ queryKey: QUERYKEY.all });
    },
  });
};

export const useEditAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editAchievement,
    onSuccess: () => {
      toast.success("achievement edited ");
      queryClient.invalidateQueries({ queryKey: QUERYKEY.all });
    },
  });
};

export const useDeleteAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAchievement,
    onSuccess: () => {
      toast.success("achievement edited ");
      queryClient.invalidateQueries({ queryKey: QUERYKEY.all });
    },
  });
};
