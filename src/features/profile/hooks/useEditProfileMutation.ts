import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditProfile } from "../services/mentorServices";
import { QUERYKEY } from "./keys";
import type { EditProfileFormData } from "../schemas/edit-profile.schema";

export const useEditProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditProfileFormData) => EditProfile(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERYKEY.all });
    },
  });
};
