import { useQuery } from "@tanstack/react-query";
import type { MenteeBookingDetailsOutput } from "../types/bookingDetails.types";
import { api } from "@/lib/axios";
import { SessionRole } from "../types/booking.types";
import {
  getAttendeeBookingDetails,
  getHostingBookingDetails,
} from "../services/booking.service";

async function fetchSessionDetail(
  bookingId: string,
): Promise<MenteeBookingDetailsOutput> {
  const res = await api.get(`/api/v1/mentor/bookings/${bookingId}`);

  const json = res.data.result as MenteeBookingDetailsOutput;

  return {
    ...json,
    startDateTime: new Date(json.startDateTime),
    endDateTime: new Date(json.endDateTime),
  };
}

export function useSessionDetail(bookingId: string, role: SessionRole) {
  return useQuery({
    queryKey: ["session-detail", bookingId],
    queryFn: () => {
      if (role === SessionRole.ATTENDING) {
        return getAttendeeBookingDetails(bookingId);
      }
      return getHostingBookingDetails(bookingId);
    },
    enabled: !!bookingId,
  });
}
