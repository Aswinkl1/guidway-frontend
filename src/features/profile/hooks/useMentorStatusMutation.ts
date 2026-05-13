import { useMutation } from "@tanstack/react-query";
import type { UpdateVisibilityDTO } from "../types/settings.types";
import { mentorStatusChanege } from "../services/settings.services";

export const useMentorVisibility = () => {
  return useMutation({
    mutationFn: (data: UpdateVisibilityDTO) => mentorStatusChanege(data),
  });
};
