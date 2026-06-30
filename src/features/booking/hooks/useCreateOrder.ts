import { useMutation } from "@tanstack/react-query";
import { createOrder } from "../services/booking.service";
import type { HoldSlotDto } from "../dto/createOrder.dto";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

const useCreateOrderMutation = () => {
  return useMutation({
    mutationFn: (data: HoldSlotDto) => createOrder(data),
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Order failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    },

    onSuccess: () => {
      toast.success("Order created successfully");
    },
  });
};

export default useCreateOrderMutation;
