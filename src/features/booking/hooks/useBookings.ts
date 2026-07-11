import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { SessionRole, type GetAllBookingParams } from "../types/booking.types";
import { createKeys } from "@/helpers/queryKeyFactor";
import {
  getAllAttendingBooking,
  getAllHostedBooking,
} from "../services/booking.service";

export function useBookings(params: GetAllBookingParams) {
  const bookingKeys = createKeys("booking");
  return useQuery({
    queryKey: [bookingKeys.list(params)],
    queryFn: () => {
      console.log(params);
      if (params.role == SessionRole.HOSTING) {
        return getAllHostedBooking(params);
      }

      return getAllAttendingBooking(params);
    },
    placeholderData: keepPreviousData,
  });
}
