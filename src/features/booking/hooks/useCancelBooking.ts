import { useMutation } from "@tanstack/react-query";
import {
  cancelBookingByMentor,
  cancelBookingByUser,
} from "../services/booking.service";
import { SessionRole } from "../types/booking.types";
import toast from "react-hot-toast";

export const UseCancelBooking = () => {
  return useMutation({
    mutationFn: ({ role, id }: { role: SessionRole; id: string }) => {
      if (role === SessionRole.HOSTING) {
        return cancelBookingByMentor(id);
      }

      return cancelBookingByUser(id);
    },
    onSuccess: () => {
      toast.success("Booking cancelled successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });
};
