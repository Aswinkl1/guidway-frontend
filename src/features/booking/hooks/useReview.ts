import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addReview } from "../services/booking.service";
import toast from "react-hot-toast";
import { bookingKeys } from "./useBookings";

export const useReview = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.details(id) });

      toast.success("review added successfully");
    },
    onError: () => {
      toast.error("some error occured");
    },
  });
};
