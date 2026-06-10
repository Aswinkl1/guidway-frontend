import { useQuery } from "@tanstack/react-query";
import { getSlots } from "../services/booking.service";

export const useSlots = (mentorId: string, date: string) => {
  return useQuery({
    queryKey: ["slot", mentorId, date],
    queryFn: () => getSlots(mentorId, date),
    enabled: !!date,
  });
};
