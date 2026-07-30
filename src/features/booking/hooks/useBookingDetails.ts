import { useQuery } from "@tanstack/react-query";
import { SessionRole } from "../types/booking.types";
import {
  getAttendeeBookingDetails,
  getHostingBookingDetails,
} from "../services/booking.service";
import { createKeys } from "@/helpers/queryKeyFactor";
import { bookingKeys } from "./useBookings";

export function useSessionDetail(bookingId: string, role: SessionRole) {
  return useQuery({
    queryKey: bookingKeys.details(bookingId),
    queryFn: () => {
      if (role === SessionRole.ATTENDING) {
        return getAttendeeBookingDetails(bookingId);
      }
      return getHostingBookingDetails(bookingId);
    },
    enabled: !!bookingId,
  });
}
