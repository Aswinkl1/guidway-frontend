import { useMutation } from "@tanstack/react-query";
import { handleFailure } from "../services/booking.service";
import toast from "react-hot-toast";

export const usePaymentFailure = () => {
  return useMutation({
    mutationFn: handleFailure,
    onError: () => {
      toast.error("error occured");
    },
  });
};
