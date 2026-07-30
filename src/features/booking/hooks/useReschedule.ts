import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rescheduleBooking } from "../services/booking.service";
import toast from "react-hot-toast";
import { bookingKeys } from "./useBookings";

export const useReschedule = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rescheduleBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.details(id) });
      toast.success("Booking rescheduled successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to reschedule booking",
      );
    },
  });
};
