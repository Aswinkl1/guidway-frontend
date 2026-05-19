import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditProfile } from "../services/mentorServices";
import { QUERYKEY } from "./keys";
import type { EditProfileFormData } from "../schemas/edit-profile.schema";
import type { UpdateVisibilityDTO } from "../types/settings.types";
import { mentorStatusChanege } from "../services/settings.services";

export const useEditProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditProfileFormData) => EditProfile(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERYKEY.all });
    },
  });
};

export const useMentorVisibilityInProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateVisibilityDTO) => mentorStatusChanege(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERYKEY.all });
    },
  });
};
