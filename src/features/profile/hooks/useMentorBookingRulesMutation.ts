import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BookingRulePayload } from "../types/settings.types";
import { mentorBookingRules } from "../services/settings.services";
import { settingsQueryKeys } from "./keys";

export const useMentorBookingRules = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BookingRulePayload) => mentorBookingRules(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsQueryKeys.all });
    },
  });
};
