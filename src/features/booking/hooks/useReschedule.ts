import { useMutation } from "@tanstack/react-query";
import { rescheduleBooking } from "../services/booking.service";
import toast from "react-hot-toast";

export const useReschedule = () => {
  return useMutation({
    mutationFn: rescheduleBooking,
    onSuccess: () => {
      toast.success("Booking rescheduled successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to reschedule booking",
      );
    },
  });
};
