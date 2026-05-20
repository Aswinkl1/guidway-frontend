import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateVisibilityDTO } from "../types/settings.types";
import { mentorStatusChanege } from "../services/settings.services";
import { settingsQueryKeys } from "./keys";

export const useMentorVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateVisibilityDTO) => mentorStatusChanege(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsQueryKeys.all });
    },
  });
};
