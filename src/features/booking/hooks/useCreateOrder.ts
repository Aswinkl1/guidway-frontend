import { useMutation } from "@tanstack/react-query";
import { createOrder } from "../services/booking.service";
import type { HoldSlotDto } from "../dto/createOrder.dto";

const useCreateOrderMutation = () => {
  return useMutation({
    mutationFn: (data: HoldSlotDto) => createOrder(data),
  });
};

export default useCreateOrderMutation;
