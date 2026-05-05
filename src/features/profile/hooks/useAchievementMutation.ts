import { useMutation } from "@tanstack/react-query";
import type { AchievementFormData } from "../schemas/achievement.schema";
import { AddAchievement } from "../services/mentorServices";
import toast from "react-hot-toast";

export const useAddAchievement = () => {
  return useMutation({
    mutationFn: (data: AchievementFormData) => AddAchievement(data),

    onSuccess: () => {
      toast.success("achievement added ");
    },
  });
};
