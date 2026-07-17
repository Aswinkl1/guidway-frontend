import { useMutation } from "@tanstack/react-query";
import { deleteReview } from "../services/booking.service";
import toast from "react-hot-toast";

export const useDeleteReview = () => {
  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      toast.success("review deleted successfully");
    },
    onError: () => {
      toast.error("some error occured");
    },
  });
};
