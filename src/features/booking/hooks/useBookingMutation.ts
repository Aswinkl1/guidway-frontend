import { useMutation } from "@tanstack/react-query";
import { confirmBooking } from "../services/booking.service";
import toast from "react-hot-toast";

export const useBookingMutation = () => {
  return useMutation({
    mutationFn: confirmBooking,
    onSuccess: () => {
      toast.success("booking successfull");
    },
  });
};
