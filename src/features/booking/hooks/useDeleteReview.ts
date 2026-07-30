import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReview } from "../services/booking.service";
import toast from "react-hot-toast";
import { bookingKeys } from "./useBookings";

export const useDeleteReview = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.details(id) });

      toast.success("review deleted successfully");
    },
    onError: () => {
      toast.error("some error occured");
    },
  });
};
