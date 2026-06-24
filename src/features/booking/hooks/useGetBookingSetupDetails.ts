import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getBookingSetupDetails } from "../services/booking.service";

export const useBookingSetupDetails = (mentorId: string, sessionId: string) => {
  return useQuery({
    queryKey: ["bookingSetupDetails", mentorId, sessionId],
    queryFn: () => getBookingSetupDetails(mentorId, sessionId),
    placeholderData: keepPreviousData,
  });
};
