import { useMutation } from "@tanstack/react-query";
import type { BookingRulePayload } from "../types/settings.types";
import { mentorBookingRules } from "../services/settings.services";

export const useMentorBookingRules = () => {
  return useMutation({
    mutationFn: (data: BookingRulePayload) => mentorBookingRules(data),
  });
};
